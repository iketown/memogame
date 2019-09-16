import { useCallback } from "react"
import moment from "moment"
import { useFirebase } from "../contexts/FirebaseCtx"
import {
  useGameCtx,
  usePointsCtx,
  useSoundCtx,
  useHouseCtx,
  useStoragePileCtx
} from "../contexts/GameCtx"
import { useGamePlayCtx } from "../contexts/GamePlayCtx"
import { useAuthCtx } from "../contexts/AuthCtx"
import { doItemsMatch, shuffle, pointsRequiredToWin } from "../utils/gameLogic"
//
//

const useFDB = ({ gameId }) => {
  console.log("useFDB called")
  const { user } = useAuthCtx()
  const { fdb, doAddToLog } = useFirebase()
  const { gamePlay } = useGamePlayCtx("useFDB")

  async function _myHouseRefAndValue() {
    const myHouseRef = fdb.ref(
      `/currentGames/${gameId}/gameStates/${user.uid}/house`
    )
    const myHouseValue = await myHouseRef.once("value").then(snapshot => {
      return snapshot.val() || {}
    })
    return { myHouseRef, myHouseValue }
  }
  async function _centerRefAndValue() {
    const centerRef = fdb.ref(`/currentGames/${gameId}/centerCardPile`)
    const centerValue = await centerRef.once("value").then(snapshot => {
      console.log("getting centerValue once")
      return snapshot.val() || []
    })
    return { centerRef, centerValue }
  }
  async function _storageRefAndValue() {
    const storageRef = fdb.ref(
      `/currentGames/${gameId}/gameStates/${user.uid}/storagePile`
    )
    const storageValue = await storageRef.once("value").then(snapshot => {
      return snapshot.val() || []
    })
    return { storageRef, storageValue }
  }
  const _pointsRefAndValue = useCallback(async () => {
    const pointsRef = fdb.ref(
      `/currentGames/${gameId}/gameStates/${user.uid}/points`
    )
    const pointsValue = await pointsRef
      .once("value")
      .then(snap => snap.val() || 0)
    return { pointsRef, pointsValue }
  }, [fdb, gameId, user.uid])

  const _addLogMessage = ({ itemId, destination }) => {
    console.log("_addLogMessage called")
    doAddToLog({
      gameId,
      uid: user.uid,
      itemId,
      destination
    })
  }

  const _endTurn = () => {
    const { memberUIDs } = gamePlay
    const myIndex = memberUIDs.findIndex(memUid => memUid === user.uid)
    const nextIndex = (myIndex + 1) % memberUIDs.length
    const nextPerson = {
      uid: memberUIDs[nextIndex],
      startTime: moment().toISOString()
    }
    fdb.ref(`/currentGames/${gameId}/whosTurnItIs`).set(nextPerson)
  }

  const _forceNextTurn = () => {
    const { memberUIDs, whosTurnItIs } = gamePlay
    const currentPlayerUid = whosTurnItIs.uid
    const currentPlayerIndex = memberUIDs.findIndex(
      _uid => _uid === currentPlayerUid
    )
    const nextPlayerIndex = (currentPlayerIndex + 1) % memberUIDs.length
    const nextPerson = {
      uid: memberUIDs[nextPlayerIndex],
      startTime: moment().toISOString()
    }
    fdb.ref(`/currentGames/${gameId}/whosTurnItIs`).set(nextPerson)
  }

  function _updateTurnTimer() {
    return fdb.ref(`/currentGames/${gameId}/whosTurnItIs`).update({
      lastCheckIn: moment().toISOString()
    })
  }

  return {
    _myHouseRefAndValue,
    _centerRefAndValue,
    _storageRefAndValue,
    _pointsRefAndValue,
    _addLogMessage,
    _endTurn,
    _forceNextTurn,
    _updateTurnTimer
  }
}

export const useGameFxns = byWho => {
  console.log("useGameFxns called by", byWho)
  const { gameId } = useGameCtx("useGameFxns")
  const { gamePlay } = useGamePlayCtx("useGameFxns")
  const { user } = useAuthCtx()
  const { dropCardSound } = useSoundCtx()
  const {
    setPointsDisplay,
    pointsClimber,
    resetPointsClimber,
    incrementPointsClimber
  } = usePointsCtx()
  const { fdb, handleWinGame } = useFirebase()

  const myGameState =
    gamePlay && gamePlay.gameStates && gamePlay.gameStates[user.uid]

  const { cardsInMyHouse, myHouse } = useHouseCtx()
  const { storagePile } = useStoragePileCtx()

  const {
    _myHouseRefAndValue,
    _centerRefAndValue,
    _storageRefAndValue,
    _pointsRefAndValue,
    _addLogMessage,
    _endTurn,
    _forceNextTurn,
    _updateTurnTimer
  } = useFDB({ gameId })

  // internal fxns
  const isItMyTurn = () => {
    const { whosTurnItIs } = gamePlay
    const yep = whosTurnItIs && user && whosTurnItIs.uid === user.uid
    console.log("is it my turn?", yep)
    return yep
  }

  const addPoints = useCallback(
    async (quantity = 1) => {
      const { pointsRef, pointsValue } = await _pointsRefAndValue()
      await pointsRef.set(pointsValue + quantity)
      if (pointsValue + quantity >= pointsRequiredToWin) {
        handleWinGame({ gameId })
      }
    },
    [_pointsRefAndValue, gameId, handleWinGame]
  )
  const subtractAPointFX = () => {
    addPoints(-1)
  }

  async function addPileToStorage(pile) {
    const { storageRef, storageValue } = await _storageRefAndValue()
    const shuffledPile = shuffle(pile)
    const newStorageValue = [...storageValue, ...shuffledPile]
    storageRef.set(newStorageValue)
  }
  async function removeFromRoomFX({ roomId, itemId }) {
    if (!roomId || !itemId)
      throw new Error(`missing roomId:${roomId} or itemId:${itemId}`)
    const { myHouseRef, myHouseValue } = await _myHouseRefAndValue()
    console.log("myHouseValue", myHouseValue)
    const newRoom = myHouseValue[roomId].filter(_itemId => _itemId !== itemId)
    myHouseValue[roomId] = newRoom
    console.log("myHouseValue", myHouseValue)
    return myHouseRef.set(myHouseValue)
  }

  // this should return new storage AND new center.
  // because it may be an invalid play
  // in which case the centerPIle gets dumped onto storage
  async function addToCenterFX({ itemId, fromHouse }) {
    const { centerRef, centerValue } = await _centerRefAndValue()
    // validate
    const [topCard] = centerValue
    const isValid = doItemsMatch(topCard, itemId)
    _addLogMessage({ itemId, destination: "center" }) // logMessage checks validity on its own
    if (isValid) {
      // UI respond to valid card
      let pointsThisPlay = 1
      if (fromHouse) {
        pointsThisPlay = pointsClimber
        incrementPointsClimber()
      } else {
        resetPointsClimber()
      }
      setPointsDisplay(pointsThisPlay)
      addPoints(pointsThisPlay)
      const newCenter = [itemId, ...centerValue]
      _updateTurnTimer()
      dropCardSound({ valid: true })
      await centerRef.set(newCenter)
      _checkIfDone(fromHouse ? "house" : "storage")
    } else {
      // UI respond to inValid card
      dropCardSound({ valid: false })
      await addPileToStorage(centerValue)
      addPoints(-centerValue.length)
      const newCenter = [itemId]
      resetPointsClimber()
      centerRef.set(newCenter)
      _endTurn()
    }
  }
  function _checkIfDone(fromWhere) {
    // this accounts for the fact that it isn't updated yet..  want the
    // ui to respond to a 'WIN' right away...
    let newHouse = cardsInMyHouse
    let newStorage = storagePile.length
    if (fromWhere === "house") newHouse--
    if (fromWhere === "storage") newStorage--
    console.log("house", newHouse)
    console.log("storage", newStorage)
    if (newHouse + newStorage === 0) handleWinGame({ gameId })
  }

  async function addToRoomFX({ roomId, itemId, index }) {
    _addLogMessage({ destination: "house", itemId })
    // setHouseTimer(itemId)
    const { myHouseRef, myHouseValue } = await _myHouseRefAndValue()
    const newHouse = { ...myHouseValue }
    newHouse[roomId] = newHouse[roomId]
      ? [
          ...newHouse[roomId].slice(0, index),
          itemId,
          ...newHouse[roomId].slice(index)
        ]
      : [itemId]
    // setSelectedRoom({ roomId, faceUp: true })
    return myHouseRef.set(newHouse)
  }

  async function removeFromStorageFX({ itemId }) {
    console.log("gamePlay in removeFromStorage", gamePlay)
    console.log("storagePild in removeFromStorage", storagePile)
    console.log("myHouse in removeFromStorage", myHouse)
    console.log("myGameState in removeFromStorage", myGameState)
    const { storageRef, storageValue } = await _storageRefAndValue()
    const newStorageVal = storageValue.filter(_itemId => _itemId !== itemId)
    storageRef.set(newStorageVal)
    // _endTurn()
  }
  function storageToCenterFX({ itemId }) {
    if (!isItMyTurn()) {
      console.log("NOT YOUR TURN!")
      return null
    }
    // removeFromStorageFX({ itemId })
    // addToCenterFX({ itemId })
  }

  function houseToCenterFX({ roomId, itemId }) {
    removeFromRoomFX({ roomId, itemId })
    addToCenterFX({ itemId, fromHouse: true })
  }
  function storageToHouseFX({ roomId, itemId, index }) {
    if (!isItMyTurn()) {
      console.log("NOT YOUR TURN!")
      return null
    }
    removeFromStorageFX({ itemId })
    addToRoomFX({ roomId, itemId, index })
    _addLogMessage({ itemId, destination: "house" })
  }
  async function reorderRoomFX({ itemId, roomId, sourceIndex, destIndex }) {
    console.log("reorder room", { itemId, roomId, sourceIndex, destIndex })
    const { myHouseRef, myHouseValue } = await _myHouseRefAndValue()
    const newRoom = myHouseValue[roomId]
    const [movingId] = newRoom.splice(sourceIndex, 1)
    if (movingId !== itemId)
      throw new Error(`these should match ${movingId} / ${itemId}`)
    newRoom.splice(destIndex, 0, movingId)
    myHouseRef.update({ [roomId]: newRoom })
  }
  async function emptyRoomToStorageFX({ roomId }) {
    const [
      { myHouseRef, myHouseValue },
      { storageRef, storageValue }
    ] = await Promise.all([_myHouseRefAndValue(), _storageRefAndValue()])
    const movingCards = myHouseValue[roomId] || []
    myHouseValue[roomId] = []
    myHouseRef.set(myHouseValue)
    return storageRef.set([...storageValue, ...movingCards])
  }

  // memoize all these?   useCallback?
  return {
    storageToCenterFX,
    houseToCenterFX,
    removeFromRoomFX,
    storageToHouseFX,
    emptyRoomToStorageFX,
    addToRoomFX,
    addToCenterFX,
    removeFromStorageFX,
    reorderRoomFX,
    subtractAPointFX,
    _updateTurnTimer,
    _endTurn,
    _forceNextTurn
  }
}
