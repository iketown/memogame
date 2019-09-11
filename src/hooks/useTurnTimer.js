import { useState, useEffect } from "react"
import moment from "moment"
import { useGameFxns } from "./useGameFxns"
import { useTurnTimerCtx } from "../contexts/TurnTimerCtx"
import { useGameCtx } from "../contexts/GameCtx"

//
//
export const useTurnTimer = () => {
  const { gameState } = useGameCtx()
  const secondsPerTurn = (gameState && gameState.secondsPerTurn) || 30
  const { _updateTurnTimer, _endTurn } = useGameFxns()
  const { lastCheckIn } = useTurnTimerCtx()
  const [timeUpAt, setTimeUpAt] = useState()
  const [secondsLeft, setSecondsLeft] = useState(secondsPerTurn)
  useEffect(() => {
    if (lastCheckIn) {
      // set the time when your turn is over.
      setTimeUpAt(
        moment(lastCheckIn)
          .add(secondsPerTurn, "seconds")
          .toISOString()
      )
    } else {
      // start your turn by creating a starting 'lastCheckIn' value.
      _updateTurnTimer()
    }
  }, [_updateTurnTimer, lastCheckIn, secondsPerTurn])
  useEffect(() => {
    if (timeUpAt) {
      const everySecond = setInterval(() => {
        const now = new moment()
        const end = moment(timeUpAt).endOf("second")
        const secs = Math.ceil(end.diff(now) / 1000)
        if (secs > 0) {
          setSecondsLeft(secs)
        } else {
          _endTurn()
        }
      }, 500)

      return () => clearInterval(everySecond)
    }
  }, [_endTurn, timeUpAt])
  return { secondsLeft }
}

export const useOthersTurnTimer = ({ playerId }) => {
  const { gamePlay, gameState } = useGameCtx()
  const [timeUpAt, setTimeUpAt] = useState()
  const [secondsLeft, setSecondsLeft] = useState(0)
  const doCounter =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === playerId
  const secondsPerTurn = (gameState && gameState.secondsPerTurn) || 30

  useEffect(() => {
    if (doCounter) {
      if (gamePlay.whosTurnItIs.lastCheckIn) {
        const newTimeUpAt = moment(gamePlay.whosTurnItIs.lastCheckIn)
          .add(secondsPerTurn, "seconds")
          .toISOString()
        setTimeUpAt(newTimeUpAt)
      }
    }
  }, [doCounter, gamePlay, playerId, secondsPerTurn])

  useEffect(() => {
    if (doCounter && timeUpAt) {
      const everySecond = setInterval(() => {
        const now = new moment()
        const end = moment(timeUpAt).endOf("second")
        const secs = Math.ceil(end.diff(now) / 1000)
        if (secs >= 0) {
          setSecondsLeft(secs)
        }
      }, 500)

      return () => clearInterval(everySecond)
    }
  }, [doCounter, timeUpAt])
  if (doCounter) return secondsLeft
  return null
}
