import React from "react"
import Timer from "react-compound-timer"
import moment from "moment"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx"

//
//
const TurnTimer = ({ playerId, children, render = () => null }) => {
  const { gamePlay } = useGamePlayCtx("TurnTimer")
  const secondsPerTurn = 20
  const lastCheckIn =
    gamePlay &&
    gamePlay.whosTurnItIs &&
    (gamePlay.whosTurnItIs.lastCheckIn || gamePlay.whosTurnItIs.startTime)
  const endTime = moment(lastCheckIn).add(secondsPerTurn, "seconds")
  const initialTime = moment.duration(endTime.diff(moment()))

  // if (!(gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === playerId))
  //   return null
  return (
    <div>
      <Timer
        key={initialTime}
        initialTime={initialTime}
        direction="backward"
        // checkpoints={[{ time: 0, callback: () => null }]}
      >
        {({ getTime }) => render({ getTime })}
      </Timer>
    </div>
  )
}

export default TurnTimer
