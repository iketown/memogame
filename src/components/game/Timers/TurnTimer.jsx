import React, { useEffect } from "react"
import Timer from "react-compound-timer"
import moment from "moment"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx"
import { secondsPerTurn } from "../../../utils/gameLogic"
import { useGameFxnsLOC } from "../../../hooks/useGameFxnsLOC"
//
//
const TurnTimer = ({ playerId, children, render = () => null }) => {
  const { gamePlay } = useGamePlayCtx("TurnTimer")
  const { forceNextTurn } = useGameFxnsLOC()
  const endTurnTime =
    (gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.endTurnTime) ||
    moment(gamePlay.whosTurnItIs.startTime).add(secondsPerTurn, "seconds")
  const initialTime = moment(endTurnTime).diff(moment())
  useEffect(() => {
    if (moment(endTurnTime) < moment().add(10, "seconds")) {
      console.log("forcing turn change")
      forceNextTurn()
    }
  }, [endTurnTime, forceNextTurn])
  return (
    <div>
      <Timer
        key={initialTime}
        initialTime={initialTime}
        direction="backward"
        checkpoints={[{ time: 0, callback: forceNextTurn }]}
      >
        {({ getTime }) => render({ getTime })}
      </Timer>
    </div>
  )
}

export default TurnTimer
