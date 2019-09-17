import React, { useEffect } from "react"
import { useGameCtx } from "../contexts/GameCtx"
import { useAuthCtx } from "../contexts/AuthCtx"
import moment from "moment"
import { useGamePlayCtx } from "../contexts/GamePlayCtx"
import { useGameFxnsLOC } from "./useGameFxnsLOC"
import Timer from "react-compound-timer"
//
//
export const Admin = () => {
  const { gameState } = useGameCtx("Admin")
  const { gamePlay } = useGamePlayCtx("Admin")
  const { forceNextTurn } = useGameFxnsLOC()
  const { user } = useAuthCtx()
  const iAmAdmin = gameState && user && gameState.startedBy === user.uid
  const whosTurnItIs = gamePlay && gamePlay.whosTurnItIs
  const endTurnTime = whosTurnItIs.endTurnTime

  useEffect(() => {
    if (iAmAdmin && whosTurnItIs && gameState && user) {
      const endTurnTime = whosTurnItIs.endTurnTime
      if (!endTurnTime) throw new Error("missing endTurnTime")
      const msUntilTurnOver = moment(endTurnTime).diff(moment())
      console.log("seconds left", msUntilTurnOver / 1000)
      const timeOut = setTimeout(() => {
        console.log("TURN IS OVER.  changing player", moment().toISOString())
        forceNextTurn()
      }, msUntilTurnOver)
      return clearTimeout(timeOut)
    }
  }, [whosTurnItIs, gameState, iAmAdmin, user, forceNextTurn])

  return (
    <Timer
      direction="backward"
      initialTime={moment(endTurnTime).diff(moment())}
    >
      <Timer.Seconds />
    </Timer>
  )
}
