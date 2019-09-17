import React from "react"
//
import { useAuthCtx } from "../contexts/AuthCtx"
import {
  GameCtxProvider,
  StoragePileCtxProvider,
  PointsCtxProvider,
  SoundCtxProvider
} from "../contexts/GameCtx"
import { ChatCtxProvider } from "../contexts/ChatCtx"
import GameContent from "../components/game/GameContent.jsx"
import SnackbarHandler from "../components/SnackBarHandler.jsx"
import { PlayersCtxProvider } from "../contexts/PlayersCtx"
import { GamePlayCtxProvider } from "../contexts/GamePlayCtx"
import GameSounds from "../sounds/GameSounds.jsx"
import GamePauser from "./GamePauser.jsx"
//
//
const Game = props => {
  const { user } = useAuthCtx()
  const { gameId } = props.match.params

  if (!user) return <div>must sign in</div>
  return (
    <GameCtxProvider gameId={gameId}>
      <GamePlayCtxProvider gameId={gameId}>
        <PointsCtxProvider>
          <PlayersCtxProvider>
            <StoragePileCtxProvider gameId={gameId}>
              <ChatCtxProvider gameId={gameId}>
                <SoundCtxProvider>
                  <SnackbarHandler gameId={gameId} />
                  <GameContent />
                  <GameSounds />
                  <GamePauser />
                </SoundCtxProvider>
              </ChatCtxProvider>
            </StoragePileCtxProvider>
          </PlayersCtxProvider>
        </PointsCtxProvider>
      </GamePlayCtxProvider>
    </GameCtxProvider>
  )
}

export default Game
