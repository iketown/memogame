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
import moment from "moment"
import { storage } from "firebase"
import { useFirebase } from "../contexts/FirebaseCtx"

export const useGameFxnsLOC = byWho => {
  console.log("useGameFxns called by", byWho)
  const { gameId } = useGameCtx("useGameFxns")
  const { gamePlay } = useGamePlayCtx("useGameFxns")
  const { user } = useAuthCtx()
  const { dropCardSound } = useSoundCtx()
  const { fdb } = useFirebase()
  const {
    setPointsDisplay,
    pointsClimber,
    resetPointsClimber,
    incrementPointsClimber
  } = usePointsCtx()
  const myGameState =
    gamePlay && gamePlay.gameStates && gamePlay.gameStates[user.uid]

  async function _sendNewGameState({
    centerCardPile,
    myUpdateObj,
    whosTurnItIs
  }) {
    console.log(" sending newGameState", {
      centerCardPile,
      myUpdateObj,
      whosTurnItIs
    })
    if (!gamePlay) throw new Error("missing gamePlay")
    if (centerCardPile && myUpdateObj) {
      const gameRef = fdb.ref(`/currentGames/${gameId}`)
      const newGamePlay = { ...gamePlay }
      const myOldGameState = gamePlay.gameStates[user.uid]
      newGamePlay.centerCardPile = centerCardPile
      newGamePlay.gameStates[user.uid] = { ...myOldGameState, ...myUpdateObj }
      gameRef.update({ ...newGamePlay })
    }

    if (myUpdateObj) {
      // moving things around in house doesn't affect others states
      const myGameStateRef = fdb.ref(
        `/currentGames/${gameId}/gameStates/${user.uid}`
      )
      myGameStateRef.update(myUpdateObj)
    }
  }
  function _addPoints(quantity) {
    const { points } = myGameState
    return points ? points + quantity : quantity
  }
  function _removeFromHouse({ roomId, itemId }) {
    const newHouse = { ...myGameState.house }
    if (!newHouse) throw new Error("house is missing")
    const newRoom = newHouse[roomId].filter(houseItem => houseItem !== itemId)
    newHouse[roomId] = newRoom
    return newHouse
  }
  function _addToHouse({ roomId, itemId, index }) {
    const newHouse = { ...myGameState.house }
    if (!newHouse) throw new Error("house is missing")
    if (newHouse[roomId]) {
      const newIndex = index || newHouse[roomId].length
      newHouse[roomId] = [
        ...newHouse[roomId].slice(0, newIndex),
        itemId,
        ...newHouse[roomId].slice(newIndex)
      ]
    } else {
      newHouse[roomId] = [itemId]
    }
    return newHouse
  }
  function _removeFromStorage({ itemId }) {
    if (!itemId) throw new Error("missing itemId")
    const { storagePile: oldStoragePile } = myGameState
    if (!oldStoragePile) throw new Error("storagePile missing")
    const [topCard, ...restOfCards] = oldStoragePile
    if (topCard === itemId) {
      return restOfCards
    } else {
      throw new Error("topCard should equal itemID")
    }
  }
  function _updateWhosTurnItIs({ endTurnBool }) {
    if (!gamePlay) throw new Error("no gamePlay!")
    if (endTurnBool) {
      // next persons turn
      const { memberUIDs } = gamePlay
      const currentTurnIndex = memberUIDs.findIndex(
        id => id === gamePlay.whosTurnItIs.uid
      )
      const nextTurnIndex = (currentTurnIndex + 1) % memberUIDs.length
      return {
        // no lastCheckIn, that comes from player
        startTime: moment().toISOString(),
        uid: memberUIDs[nextTurnIndex]
      }
    } else {
      // same persons turn, just update the checkin
      const newWTII = {
        ...gamePlay.whosTurnItIs,
        lastCheckIn: moment().toISOString()
      }
      return newWTII
    }
  }

  function _addToCenter({ itemId, fromHouse = false }) {
    const { centerCardPile: oldCenterCardPile = [] } = gamePlay
    const { storagePile: oldStoragePile = [] } = myGameState
    if (!gamePlay) throw new Error("missing gamePlay")
    const [topCard] = oldCenterCardPile
    const isValid = doItemsMatch(topCard, itemId)
    let points
    let centerCardPile
    let endTurnBool = false
    let storagePile
    if (isValid) {
      // UI respond to valid card
      let pointsThisPlay = 1
      if (fromHouse) {
        pointsThisPlay = pointsClimber
        incrementPointsClimber()
      } else {
        // card is from storage pile
        storagePile = _removeFromStorage({ itemId })
        resetPointsClimber()
      }
      setPointsDisplay(pointsThisPlay)
      points = _addPoints(pointsThisPlay)
      centerCardPile = [itemId, ...oldCenterCardPile]
      dropCardSound({ valid: true })
      // await centerRef.set(centerCardPile)
      //   _checkIfDone(fromHouse ? "house" : "storage")
    } else {
      // UI respond to inValid card
      dropCardSound({ valid: false })
      points = _addPoints(-oldCenterCardPile.length)
      centerCardPile = [itemId]
      const shuffledOldCenterCardPile = shuffle(oldCenterCardPile)
      storagePile = [...oldStoragePile, ...shuffledOldCenterCardPile]
      resetPointsClimber()
      endTurnBool = true
    }
    return { storagePile, centerCardPile, points, endTurnBool }
  }

  function storageToHouse({ roomId, itemId, index }) {
    const storagePile = _removeFromStorage({ itemId })
    const house = _addToHouse({ roomId, itemId, index })
    const myUpdateObj = { house, storagePile }
    _sendNewGameState({ myUpdateObj }) // no gameUpdateObj needed
  }
  function storageToCenter({ itemId }) {
    const { storagePile, centerCardPile, points, endTurnBool } = _addToCenter({
      itemId,
      fromHouse: false
    })
    const whosTurnItIs = _updateWhosTurnItIs({ endTurnBool })
    _sendNewGameState({
      whosTurnItIs,
      centerCardPile,
      myUpdateObj: { storagePile, points }
    })
  }
  function houseToCenter({ roomId, itemId }) {
    const house = _removeFromHouse({ roomId, itemId })
    const { storagePile, centerCardPile, points, endTurnBool } = _addToCenter({
      itemId,
      fromHouse: true
    })
    const whosTurnItIs = _updateWhosTurnItIs({ endTurnBool })
    _sendNewGameState({
      whosTurnItIs,
      centerCardPile,
      myUpdateObj: { storagePile, points, house }
    })
  }

  function reorderRoom({ itemId, roomId, sourceIndex, destIndex }) {}

  return {
    storageToHouse,
    storageToCenter,
    houseToCenter,
    reorderRoom
  }
}
