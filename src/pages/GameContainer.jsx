import React from "react"
//
import { useAuthCtx } from "../contexts/AuthCtx"
import {
  GameCtxProvider,
  HouseCtxProvider,
  CenterPileCtxProvider,
  StoragePileCtxProvider,
  PointsCtxProvider,
  SoundCtxProvider
} from "../contexts/GameCtx"
import { ChatCtxProvider } from "../contexts/ChatCtx"
import GameContent from "../components/game/GameContent.jsx"
import SnackbarHandler from "../components/SnackBarHandler.jsx"
import { PlayersCtxProvider } from "../contexts/PlayersCtx"
import { GamePlayCtxProvider } from "../contexts/GamePlayCtx"
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
            <HouseCtxProvider gameId={gameId}>
              <StoragePileCtxProvider gameId={gameId}>
                <CenterPileCtxProvider gameId={gameId}>
                  <ChatCtxProvider gameId={gameId}>
                    <SoundCtxProvider>
                      <SnackbarHandler gameId={gameId} />
                      <GameContent />
                      {/* <GameSounds /> */}
                    </SoundCtxProvider>
                  </ChatCtxProvider>
                </CenterPileCtxProvider>
              </StoragePileCtxProvider>
            </HouseCtxProvider>
          </PlayersCtxProvider>
        </PointsCtxProvider>
      </GamePlayCtxProvider>
    </GameCtxProvider>
  )
}

export default Game
