import React, { useState } from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import AvatarMonster from "../../AvatarMonster"
import { useGameCtx } from "../../../contexts/GameCtx"
import PlayerDisplay from "./PlayerDisplay.responsive"

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-around;
`

const ScoreSection = () => {
  const { gamePlay } = useGameCtx()
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
      {/* {Array.from({ length: 3 }, (_, index) => index).map(x => (
        <PersonScoreContainer
          key={x}
          onClick={() => setTurn(x)}
          myTurn={turn === x}
        >
          <AvatarMonster num={x + 1} />
          <Typography variant="caption">iketown</Typography>
        </PersonScoreContainer>
      ))} */}
    </FlexDiv>
  )
}

export default ScoreSection
