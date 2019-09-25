import React, { useEffect, useCallback } from "react"
import Timer from "react-compound-timer"
import moment from "moment"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx"
import { secondsPerTurn } from "../../../utils/gameLogic"
import { useGameFxnsLOC } from "../../../hooks/useGameFxnsLOC"
//
//
const TurnTimer = ({ playerId, children, render = () => null }) => {
  const { gamePlay, whosOnline } = useGamePlayCtx("TurnTimer")
  const { forceNextTurn } = useGameFxnsLOC()

  const handleChangeTurn = useCallback(() => {
    if (whosOnline && whosOnline.all) {
      forceNextTurn()
    }
  }, [forceNextTurn, whosOnline])

  const endTurnTime =
    (gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.endTurnTime) ||
    moment(gamePlay.whosTurnItIs.startTime).add(secondsPerTurn, "seconds")
  const initialTime = moment(endTurnTime).diff(moment())
  useEffect(() => {
    if (moment(endTurnTime).add(10, "seconds") < moment()) {
      handleChangeTurn()
    }
  }, [endTurnTime, handleChangeTurn])
  return (
    <div>
      <Timer
        key={initialTime}
        initialTime={initialTime}
        direction="backward"
        checkpoints={[{ time: 0, callback: handleChangeTurn }]}
      >
        {({ getTime }) => render({ getTime })}
      </Timer>
    </div>
  )
}

export default TurnTimer
