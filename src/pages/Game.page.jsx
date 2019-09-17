import React from "react"
//
import { useAuthCtx } from "../contexts/AuthCtx"
import {
  GameCtxProvider,
  HouseCtxProvider,
  StoragePileCtxProvider,
  PointsCtxProvider,
  SoundCtxProvider
} from "../contexts/GameCtx"
import GameSounds from "../sounds/GameSounds.jsx"
import { ChatCtxProvider } from "../contexts/ChatCtx"
import GameContent from "../components/game/GameContent.jsx"
import SnackbarHandler from "../components/SnackBarHandler.jsx"
import { PlayersCtxProvider } from "../contexts/PlayersCtx"
import { TurnTimerCtxProvider } from "../contexts/TurnTimerCtx"
//
//
const Game = props => {
  const { user } = useAuthCtx()
  const { gameId } = props.match.params

  if (!user) return <div>must sign in</div>

  return (
    <GameCtxProvider gameId={gameId}>
      <PointsCtxProvider>
        <TurnTimerCtxProvider gameId={gameId}>
          <PlayersCtxProvider>
            <StoragePileCtxProvider gameId={gameId}>
              <ChatCtxProvider gameId={gameId}>
                <SoundCtxProvider>
                  <SnackbarHandler gameId={gameId} />
                  <GameSounds />
                  <GameContent gameId={gameId} />
                </SoundCtxProvider>
              </ChatCtxProvider>
            </StoragePileCtxProvider>
          </PlayersCtxProvider>
        </TurnTimerCtxProvider>
      </PointsCtxProvider>
    </GameCtxProvider>
  )
}

export default Game
