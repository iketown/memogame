import React from "react"
import styled from "styled-components"
import PlayerDisplay from "./PlayerDisplay.responsive"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx"

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-around;
`

const OfflineDisplay = styled.div`
  opacity: ${p => (p.online ? 1 : 0.5)};
  background: ${p =>
    p.online
      ? "none"
      : `
    repeating-linear-gradient(45deg,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.2) 10px,
    rgba(0, 0, 0, 0.3) 10px,
    rgba(0, 0, 0, 0.3) 20px)`};
  position: relative;
  .offline {
    position: absolute;
    transform: rotate(-25deg) translateX(-50%);
    z-index: 100;
    top: 60%;
    left: 50%;
    font-size: 1rem;
    font-weight: bold;
    color: blue;
  }
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
          .map(([playerId, playerState]) => {
            const online = whosOnline && !!whosOnline[playerId]
            return (
              <OfflineDisplay key={playerId} online={online}>
                {!online && <div className="offline">OFFLINE</div>}
                <PlayerDisplay key={playerId} playerId={playerId} />
              </OfflineDisplay>
            )
          })}
    </FlexDiv>
  )
}

export default ScoreSection
