import moment from "moment"
import { useFirebase } from "../contexts/FirebaseCtx"
import {
  useGameCtx,
  usePointsCtx,
  useSoundCtx,
  useHouseCtx,
  useCenterPileCtx,
  useStoragePileCtx
} from "../contexts/GameCtx"
import { useAuthCtx } from "../contexts/AuthCtx"
import { doItemsMatch, shuffle, pointsRequiredToWin } from "../utils/gameLogic"
import { useLogCtx } from "../contexts/LogCtx"

//
//
export const useGameFxns = () => {
  const { gameId, gamePlay } = useGameCtx()
  const { dropCardSound } = useSoundCtx()
  const {
    setPointsDisplay,
    pointsClimber,
    resetPointsClimber,
    incrementPointsClimber
  } = usePointsCtx()
  const { user } = useAuthCtx()
  const { fdb, handleWinGame } = useFirebase()
  const { addLogMessage } = useLogCtx()
  const { cardsInMyHouse, addToHouseTimer } = useHouseCtx()
  const { storagePile } = useStoragePileCtx()
  // internal fxns
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
  async function _pointsRefAndValue() {
    const pointsRef = fdb.ref(
      `/currentGames/${gameId}/gameStates/${user.uid}/points`
    )
    const pointsValue = await pointsRef
      .once("value")
      .then(snap => snap.val() || 0)
    return { pointsRef, pointsValue }
  }
  const addPoints = async (quantity = 1) => {
    const { pointsRef, pointsValue } = await _pointsRefAndValue()
    await pointsRef.set(pointsValue + quantity)
    if (pointsValue + quantity >= pointsRequiredToWin) {
      handleWinGame({ gameId })
    }
  }
  function _endTurn() {
    const { memberUIDs } = gamePlay
    const myIndex = memberUIDs.findIndex(memUid => memUid === user.uid)

    if (myIndex === -1) throw new Error(`not found in this game ???`)
    const nextIndex = (myIndex + 1) % memberUIDs.length
    const nextPerson = {
      uid: memberUIDs[nextIndex],
      startTime: moment().toISOString()
    }
    fdb.ref(`/currentGames/${gameId}/whosTurnItIs`).set(nextPerson)
  }
  function _updateTurnTimer() {
    return fdb.ref(`/currentGames/${gameId}/whosTurnItIs`).update({
      lastCheckIn: moment().toISOString()
    })
  }
  async function addPileToStorage(pile) {
    const { storageRef, storageValue } = await _storageRefAndValue()
    shuffle(pile)
    const newStorageValue = [...storageValue, ...pile]
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
  async function addToCenterFX({ itemId, fromHouse }) {
    const { centerRef, centerValue } = await _centerRefAndValue()
    // validate
    const [topCard] = centerValue
    const isValid = doItemsMatch(topCard, itemId)
    addLogMessage({ itemId, destination: "center" }) // logMessage checks validity on its own
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
    if (newHouse + newStorage === 0) handleWinGame()
  }
  async function togglePauseGame() {
    const whoseTurnRef = fdb.ref(`/currentGames/${gameId}/whosTurnItIs`)
    let value
    whoseTurnRef.once("value", snapshot => {
      value = snapshot.val()
    })
    const { paused } = value
    console.log("paused", paused)
    if (paused) {
      whoseTurnRef.update({
        paused: false,
        lastCheckIn: moment().toISOString()
      })
    }
    whoseTurnRef.update({
      paused: !paused
    })
  }
  // async function setHouseTimer(itemId, time = moment().toISOString()) {
  //   const houseTimerRef = fdb.ref(
  //     `/currentGames/${gameId}/gameStates/${user.uid}/houseTimer`
  //   )
  //   houseTimerRef.update({ [itemId]: time })
  // }
  async function addToRoomFX({ roomId, itemId }) {
    addLogMessage({ destination: "house", itemId })
    // setHouseTimer(itemId)
    const { myHouseRef, myHouseValue } = await _myHouseRefAndValue()
    const newHouse = { ...myHouseValue }
    newHouse[roomId] = newHouse[roomId]
      ? [...newHouse[roomId], itemId] // add it to the bottom
      : [itemId]
    addToHouseTimer(itemId)
    return myHouseRef.set(newHouse)
  }

  async function removeFromStorageFX({ itemId }) {
    const { storageRef, storageValue } = await _storageRefAndValue()
    const newStorageVal = storageValue.filter(_itemId => _itemId !== itemId)
    storageRef.set(newStorageVal)
    // _endTurn()
  }
  function storageToCenterFX({ itemId }) {
    removeFromStorageFX({ itemId })
    addToCenterFX({ itemId })
  }

  function houseToCenterFX({ roomId, itemId }) {
    removeFromRoomFX({ roomId, itemId })
    addToCenterFX({ itemId, fromHouse: true })
  }
  function storageToHouseFX({ roomId, itemId }) {
    removeFromStorageFX({ itemId })
    addToRoomFX({ roomId, itemId })
    addLogMessage({ itemId, destination: "house" })
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
    _updateTurnTimer,
    _endTurn,
    togglePauseGame
  }
}
