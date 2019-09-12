import React, { useEffect, useCallback } from "react"
import { Button } from "@material-ui/core"
import { useGameFxns } from "../../../hooks/useGameFxns"
import { useGameCtx } from "../../../contexts/GameCtx"
import { useAuthCtx } from "../../../contexts/AuthCtx"
import ShowMe from "../../../utils/ShowMe.jsx"
import Timer from "react-compound-timer"
import moment from "moment"
import styled from "styled-components"
import { usePlayersCtx } from "../../../contexts/PlayersCtx"

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
  const { gamePlay, gameState } = useGameCtx()
  const { _endTurn, _updateTurnTimer } = useGameFxns()
  const { players } = usePlayersCtx()
  const { user } = useAuthCtx()
  const secondsPerTurn = 20

  const lastCheckIn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.lastCheckIn
  const myTurn = gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid
  useEffect(() => {
    if (myTurn && !lastCheckIn) {
      console.log("updating turn timer")
      _updateTurnTimer()
    }
  }, [_updateTurnTimer, lastCheckIn, myTurn])

  function handleTimeUp() {
    // if (gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid) {
    //   _endTurn()
    // }
    console.log("end turn called")
  }

  if (!(gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === playerId))
    return null

  const endTime = moment(gamePlay.whosTurnItIs.lastCheckIn).add(
    secondsPerTurn,
    "seconds"
  )
  const initialTime = moment.duration(endTime.diff(moment()))
  return (
    <div>
      <Timer
        initialTime={initialTime}
        direction="backward"
        checkpoints={[{ time: 0, callback: handleTimeUp }]}
      >
        {({ stop, start, reset, timerState, getTime }) =>
          getTime() > 0 ? (
            <BoxContainer>
              {Array.from({ length: Math.min(getTime() / 1000, 20) }).map(
                (sec, i) => (
                  <GreenBox key={i} />
                )
              )}
            </BoxContainer>
          ) : (
            <span style={{ fontSize: "9px", color: "red" }}>
              game admin has disconnected
            </span>
          )
        }
      </Timer>
    </div>
  )
}

export default TurnTimer
