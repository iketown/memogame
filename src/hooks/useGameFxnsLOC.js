import {
  useGameCtx,
  usePointsCtx,
  useSoundCtx,
  useStoragePileCtx
} from "../contexts/GameCtx"
import { useCallback } from "react"
import { useGamePlayCtx } from "../contexts/GamePlayCtx"
import { useAuthCtx } from "../contexts/AuthCtx"
import { doItemsMatch, shuffle, pointsRequiredToWin } from "../utils/gameLogic"
import moment from "moment"
import { storage } from "firebase"
import { useFirebase } from "../contexts/FirebaseCtx"
import { secondsPerTurn } from "../utils/gameLogic"
import { useDialogCtx } from "../contexts/DialogCtx"
import { usePlayersCtx } from "../contexts/PlayersCtx"
import { getGameScores } from "../pages/GameOver"

export const useGameFxnsLOC = byWho => {
  console.log("useGameFxnsLOC called by", byWho)
  const { gameId, gameState } = useGameCtx("useGameFxns")
  const { players } = usePlayersCtx()
  const { gamePlay, myTotalCards } = useGamePlayCtx("useGameFxns")
  const { user } = useAuthCtx()
  const { dropCardSound } = useSoundCtx()
  const { fdb, handleEndGame } = useFirebase()
  const { dispatch } = useDialogCtx()
  const {
    setPointsDisplay,
    pointsClimber,
    resetPointsClimber,
    incrementPointsClimber
  } = usePointsCtx()
  const myGameState =
    gamePlay && gamePlay.gameStates && gamePlay.gameStates[user.uid]

  const amIDone = useCallback(
    ({ myUpdateObj }) => {
      const allMyCards = []
      if (!!myUpdateObj && myUpdateObj.points >= pointsRequiredToWin)
        return true
      if (myGameState) {
        if (myGameState.points >= pointsRequiredToWin) return true
        const storagePile =
          (myUpdateObj && myUpdateObj.storagePile) ||
          myGameState.storagePile ||
          []
        const house =
          (myUpdateObj && myUpdateObj.house) || myGameState.house || {}

        allMyCards.push(...storagePile)

        Object.values(house).forEach(room => {
          allMyCards.push(...room)
        })
        if (allMyCards.length <= 0) return true
      }
      return false
    },
    [myGameState]
  )
  const handleGameOver = useCallback(() => {
    console.log("game is OVER! newGameState")
    const scores = getGameScores({ gamePlay, players })
    handleEndGame({ gameId, scores })
  }, [gameId, gamePlay, handleEndGame, players])

  const _sendNewGameState = useCallback(
    ({ centerCardPile, myUpdateObj, whosTurnItIs, calledFrom }) => {
      console.log(`sending newGameState from ${calledFrom}`, {
        centerCardPile,
        myUpdateObj,
        whosTurnItIs
      })
      if (!gamePlay) throw new Error("missing gamePlay")
      if (centerCardPile && myUpdateObj && whosTurnItIs) {
        const gameRef = fdb.ref(`/currentGames/${gameId}`)
        const newGamePlay = { ...gamePlay }
        const myOldGameState = gamePlay.gameStates[user.uid]
        newGamePlay.centerCardPile = centerCardPile
        newGamePlay.whosTurnItIs = whosTurnItIs
        newGamePlay.gameStates[user.uid] = { ...myOldGameState, ...myUpdateObj }
        newGamePlay.lastCardBy = user.uid
        gameRef.update({ ...newGamePlay })
      } else {
        if (myUpdateObj) {
          // moving things around in house or changing points doesn't affect others states
          const myGameStateRef = fdb.ref(
            `/currentGames/${gameId}/gameStates/${user.uid}`
          )
          myGameStateRef.update(myUpdateObj)
        }
        if (whosTurnItIs) {
          const wTIIRef = fdb.ref(`/currentGames/${gameId}/whosTurnItIs`)
          wTIIRef.update(whosTurnItIs)
        }
      }
      const gameIsOver = amIDone({ myUpdateObj })
      if (gameIsOver) handleGameOver()
    },
    [amIDone, fdb, gameId, gamePlay, handleGameOver, user.uid]
  )

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
  const _updateWhosTurnItIs = useCallback(
    ({ endTurnBool, extendEndTurnTime }) => {
      if (!gamePlay) throw new Error("no gamePlay!")
      if (endTurnBool) {
        // next persons turn
        const { memberUIDs } = gamePlay
        const currentTurnIndex = memberUIDs.findIndex(
          id => id === gamePlay.whosTurnItIs.uid
        )
        const nextTurnIndex = (currentTurnIndex + 1) % memberUIDs.length
        return {
          ...gamePlay.whosTurnItIs,
          startTime: moment().toISOString(),
          endTurnTime: moment()
            .add(secondsPerTurn, "seconds")
            .toISOString(),
          uid: memberUIDs[nextTurnIndex]
        }
      } else {
        // same persons turn, just update the checkin
        const newWTII = {
          ...gamePlay.whosTurnItIs,
          lastCheckIn: moment().toISOString()
        }
        if (extendEndTurnTime) {
          newWTII.endTurnTime = moment()
            .add(secondsPerTurn, "seconds")
            .toISOString()
        }
        return newWTII
      }
    },
    [gamePlay]
  )

  function _addToCenter({ itemId, fromHouse = false, noPoints = false }) {
    const isMyTurn = gamePlay.whosTurnItIs.uid === user.uid
    const { centerCardPile: oldCenterCardPile = [] } = gamePlay
    let { storagePile: oldStoragePile = [] } = myGameState
    if (!gamePlay) throw new Error("missing gamePlay")
    const [topCard] = oldCenterCardPile
    const isValid = doItemsMatch(topCard, itemId)
    let points
    let centerCardPile
    let endTurnBool = false
    let storagePile = [...oldStoragePile]

    if (isValid) {
      // UI respond to valid card
      let pointsThisPlay = 1
      if (fromHouse) {
        if (noPoints) {
          resetPointsClimber()
          pointsThisPlay = 1
        } else {
          pointsThisPlay = pointsClimber
          incrementPointsClimber()
        }
      } else {
        // card is from storage pile
        resetPointsClimber()
        storagePile = _removeFromStorage({ itemId })
      }
      setPointsDisplay(pointsThisPlay)
      points = _addPoints(pointsThisPlay)
      centerCardPile = [itemId, ...oldCenterCardPile]
      dropCardSound({ valid: true })
      // await centerRef.set(centerCardPile)
      //   _checkIfDone(fromHouse ? "house" : "storage")
    } else {
      // UI respond to inValid card
      if (fromHouse) {
        // do whatever
      } else {
        // from storage pile
        oldStoragePile = _removeFromStorage({ itemId })
      }
      dropCardSound({ valid: false })
      points = _addPoints(-oldCenterCardPile.length)
      centerCardPile = [itemId]
      const shuffledOldCenterCardPile = shuffle(oldCenterCardPile)
      storagePile = [...oldStoragePile, ...shuffledOldCenterCardPile]
      resetPointsClimber()
      endTurnBool = isMyTurn ? true : false
    }
    return { storagePile, centerCardPile, points, endTurnBool }
  }

  function storageToHouse({ roomId, itemId, index }) {
    const storagePile = _removeFromStorage({ itemId })
    const house = _addToHouse({ roomId, itemId, index })
    const myUpdateObj = { house, storagePile }
    const whosTurnItIs = {
      ...gamePlay.whosTurnItIs,
      lastCheckIn: moment().toISOString()
    }
    _sendNewGameState({
      myUpdateObj,
      whosTurnItIs,
      calledFrom: "storageToHouse"
    })
  }
  function storageToCenter({ itemId }) {
    const { storagePile, centerCardPile, points, endTurnBool } = _addToCenter({
      itemId,
      fromHouse: false
    })
    const whosTurnItIs = _updateWhosTurnItIs({
      endTurnBool,
      extendEndTurnTime: true
    })
    const newGameState = {
      whosTurnItIs,
      centerCardPile,
      myUpdateObj: { storagePile, points },
      calledFrom: "storageToCenter"
    }
    console.log("storageToCenter newGameState", newGameState)
    _sendNewGameState(newGameState)
  }
  function houseToCenter({ roomId, itemId, noPoints }) {
    const house = _removeFromHouse({ roomId, itemId })
    let { storagePile, centerCardPile, points, endTurnBool } = _addToCenter({
      itemId,
      fromHouse: true,
      noPoints
    })
    const whosTurnItIs = _updateWhosTurnItIs({
      endTurnBool,
      extendEndTurnTime: true
    })
    const newGameState = {
      whosTurnItIs,
      centerCardPile,
      myUpdateObj: { storagePile, points, house },
      calledFrom: "houseToCenter"
    }
    _sendNewGameState(newGameState)
  }
  function reorderRoom({ itemId, roomId, sourceIndex, destIndex }) {
    const newRoom = [...myGameState.house[roomId]]
    const [movingId] = newRoom.splice(sourceIndex, 1)
    if (movingId !== itemId)
      throw new Error(`these should match ${movingId} / ${itemId}`)
    newRoom.splice(destIndex, 0, movingId)
    const myUpdateObj = { house: { ...myGameState.house, [roomId]: newRoom } }
    console.log("newGameState reorderRoom", myUpdateObj)
    const whosTurnItIs = _updateWhosTurnItIs({
      endTurnBool: false,
      extendEndTurnTime: false
    })
    _sendNewGameState({ myUpdateObj, whosTurnItIs, calledFrom: "reorderRoom" })
  }
  function changePoints(delta) {
    const points = _addPoints(delta)
    _sendNewGameState({ myUpdateObj: { points }, calledFrom: "changePoints" })
  }
  const forceNextTurn = () => {
    const whosTurnItIs = _updateWhosTurnItIs({ endTurnBool: true })
    if (user.uid !== gameState.startedBy) return null
    if (gamePlay.whosTurnItIs.gamePaused) return null
    _sendNewGameState({ whosTurnItIs, calledFrom: "forceNextTurn" }) // only the admin will send this.
  }
  const endMyTurn = () => {
    const whosTurnItIs = _updateWhosTurnItIs({ endTurnBool: true })
    _sendNewGameState({ whosTurnItIs, calledFrom: "endMyTurn" })
  }
  const unpauseGame = useCallback(() => {
    const whosTurnItIs = _updateWhosTurnItIs({ endTurnBool: false })
    _sendNewGameState({
      whosTurnItIs: { ...whosTurnItIs, gamePaused: false },
      calledFrom: "unpauseGame"
    })
  }, [_sendNewGameState, _updateWhosTurnItIs])

  const pauseGame = () => {
    const whosTurnItIs = gamePlay.whosTurnItIs
    _sendNewGameState({
      whosTurnItIs: { ...whosTurnItIs, gamePaused: true },
      calledFrom: "pauseGame"
    })
  }

  return {
    storageToHouse,
    storageToCenter,
    houseToCenter,
    reorderRoom,
    changePoints,
    forceNextTurn,
    endMyTurn,
    unpauseGame,
    pauseGame
  }
}
