import React from "react"
import styled from "styled-components"
import PlayerDisplay from "./PlayerDisplay.responsive"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx"

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-around;
`

const ScoreSection = () => {
  const { gamePlay } = useGamePlayCtx("ScoreSection")
  const gameStates = gamePlay && gamePlay.gameStates

  return (
    <FlexDiv>
      {gameStates &&
        gamePlay.memberUIDs &&
        Object.entries(gameStates)
          .sort((a, b) => {
            return gamePlay.memberUIDs.indexOf(a[0]) <
              gamePlay.memberUIDs.indexOf(b[0])
              ? -1
              : 1
          })
          .map(([playerId, playerState]) => (
            <PlayerDisplay playerId={playerId} />
          ))}
    </FlexDiv>
  )
}

export default ScoreSection
