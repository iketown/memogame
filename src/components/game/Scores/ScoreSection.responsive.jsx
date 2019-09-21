import React from "react"
import styled from "styled-components"
import PlayerDisplay from "./PlayerDisplay.responsive"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx"
import ShowMe from "../../../utils/ShowMe"

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-around;
`

const OfflineDisplay = styled.div`
  opacity: ${p => (p.online ? 1 : 0.5)};
`
const ScoreSection = () => {
  const { gamePlay, whosOnline } = useGamePlayCtx("ScoreSection")
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
            <OfflineDisplay online={whosOnline && !!whosOnline[playerId]}>
              <PlayerDisplay key={playerId} playerId={playerId} />
            </OfflineDisplay>
          ))}
      <ShowMe obj={whosOnline} name="whosOnline" />
    </FlexDiv>
  )
}

export default ScoreSection
