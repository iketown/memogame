import React, { useEffect } from "react"
import { useGameCtx } from "../contexts/GameCtx"
import { useAuthCtx } from "../contexts/AuthCtx"
import moment from "moment"
import { secondsPerTurn } from "../utils/gameLogic"
import { useGamePlayCtx } from "../contexts/GamePlayCtx"
//
//
export const Admin = () => {
  const { gameState } = useGameCtx("Admin")
  const { gamePlay } = useGamePlayCtx("Admin")
  const { user } = useAuthCtx()
  const iAmAdmin = gameState && user && gameState.startedBy === user.uid
  const whosTurnItIs = gamePlay && gamePlay.whosTurnItIs
  console.log("Admin rendering  called")
  useEffect(() => {
    if (iAmAdmin && whosTurnItIs && gameState && user) {
      let startOfTurn = whosTurnItIs.lastCheckIn || whosTurnItIs.startTime
      console.log("startOfTurn", startOfTurn)
      const whenTurnIsOver = moment(startOfTurn).add(secondsPerTurn, "seconds")

      const msUntilTurnOver = moment(whenTurnIsOver).diff(moment())
      console.log("seconds left", msUntilTurnOver / 1000)
      const timeOut = setTimeout(() => {
        console.log("TURN IS OVER.  changing player", moment().toISOString())
        // _forceNextTurn()
      }, msUntilTurnOver)
      return clearTimeout(timeOut)
    }
  }, [whosTurnItIs, gameState, iAmAdmin, user])

  return <p>admin</p>
}
