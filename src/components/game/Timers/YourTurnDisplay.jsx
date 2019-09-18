import React from "react"
import styled from "styled-components"
import Timer from "react-compound-timer"
import { Button } from "@material-ui/core"
//
import TurnTimer from "./TurnTimer.jsx"
import { useAuthCtx } from "../../../contexts/AuthCtx.js"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx.js"
import { usePlayersCtx } from "../../../contexts/PlayersCtx.js"
import { useGameFxnsLOC } from "../../../hooks/useGameFxnsLOC"

const StyledText = styled.div`
  text-align: center;
  height: 100%;
  .your-turn {
    font-size: 2.5rem;
    font-weight: bold;
    color: maroon;
  }
  .seconds {
    font-size: 2rem;
    color: blue;
  }
`
//
//
const YourTurnDisplay = () => {
  const { user } = useAuthCtx()
  const { gamePlay } = useGamePlayCtx("YourTurnDisplay")
  const { players } = usePlayersCtx()
  const { endMyTurn } = useGameFxnsLOC()
  const whosTurn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid
  const itsYourTurn = whosTurn === user.uid
  if (gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.gamePaused)
    return <p>game paused</p>
  return !itsYourTurn ? (
    players[whosTurn] ? (
      <div>{players[whosTurn].displayName} is up</div>
    ) : (
      <div />
    )
  ) : (
    <div>
      <TurnTimer
        playerId={user.uid}
        render={({ getTime }) => {
          return (
            <StyledText>
              <div className="your-turn">YOUR TURN</div>
              <div className="seconds">
                <Timer.Seconds />
              </div>
              <br />
              <Button onClick={endMyTurn} variant="contained" color="primary">
                End Turn
              </Button>
            </StyledText>
          )
        }}
      />
    </div>
  )
}

export default YourTurnDisplay
