import React from "react"
import { Button } from "@material-ui/core"
import { useGameFxns } from "../../../hooks/useGameFxns"
import { useGameCtx } from "../../../contexts/GameCtx"
import { useAuthCtx } from "../../../contexts/AuthCtx"
import ShowMe from "../../../utils/ShowMe.jsx"
import Timer from "react-compound-timer"
import moment from "moment"
import styled from "styled-components"

const GreenBox = styled.div`
  height: 4px;
  width: 4px;
  margin-right: 2.5px;
  background: green;
`
const BoxContainer = styled.div`
  display: flex;
  justify-content: left;
  width: 100%;
`
//
//
const TurnTimer = ({ playerId, children }) => {
  const { gamePlay } = useGameCtx()
  const { _endTurn } = useGameFxns()
  const { user } = useAuthCtx()
  const secondsPerTurn = 20
  function handleTimeUp() {
    if (gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid) {
      _endTurn()
    }
  }
  if (!(gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === playerId))
    return null

  const endTime = moment(
    gamePlay.whosTurnItIs.lastCheckIn || gamePlay.whosTurnItIs.startTime
  ).add(secondsPerTurn, "seconds")
  const initialTime = moment.duration(endTime.diff(moment()))
  return (
    <div>
      <Timer
        initialTime={initialTime}
        direction="backward"
        checkpoints={[{ time: 0, callback: handleTimeUp }]}
      >
        {({ stop, start, reset, timerState, getTime }) => (
          <BoxContainer>
            {Array.from({ length: Math.min(getTime() / 1000, 20) }).map(
              (sec, i) => (
                <GreenBox key={i} />
              )
            )}
          </BoxContainer>
        )}
      </Timer>
    </div>
  )
}

export default TurnTimer
