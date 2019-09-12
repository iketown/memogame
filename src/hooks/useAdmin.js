import React, { useEffect, useRef } from "react"
import { useGameCtx } from "../contexts/GameCtx"
import { useAuthCtx } from "../contexts/AuthCtx"
import { useGameFxns } from "./useGameFxns"
import moment from "moment"
import { secondsPerTurn } from "../utils/gameLogic"
//
//
export const useAdmin = () => {
  const { gamePlay, gameState } = useGameCtx()
  const { user } = useAuthCtx()
  const { _forceNextTurn } = useGameFxns()
  const turnTimerRef = useRef()
  const iAmAdmin = gameState && user && gameState.startedBy === user.uid

  useEffect(() => {
    if (iAmAdmin && gamePlay && gamePlay.whosTurnItIs && gameState && user) {
      const { whosTurnItIs } = gamePlay
      let startOfTurn = whosTurnItIs.lastCheckIn || whosTurnItIs.startTime
      console.log("startOfTurn", startOfTurn)
      const whenTurnIsOver = moment(startOfTurn).add(secondsPerTurn, "seconds")

      const msUntilTurnOver = moment(whenTurnIsOver).diff(moment())
      console.log("seconds left", msUntilTurnOver / 1000)
      clearTimeout(turnTimerRef.current)
      turnTimerRef.current = setTimeout(() => {
        console.log("TURN IS OVER.  changing player", moment().toISOString())
        _forceNextTurn()
      }, msUntilTurnOver)
    }
  }, [_forceNextTurn, gamePlay, gameState, iAmAdmin, user])

  return iAmAdmin // just a boolean
}
