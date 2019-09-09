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
import GameSounds from "../sounds/GameSounds.jsx"
import { ChatCtxProvider } from "../contexts/ChatCtx"
import GameContent from "../components/game/GameContent.jsx"
import GamePage from "../components/game/GamePage.responsive.jsx"
import SnackbarHandler from "../components/SnackBarHandler.jsx"
import { PlayersCtxProvider } from "../contexts/PlayersCtx"
import { TurnTimerCtxProvider } from "../contexts/TurnTimerCtx"
import { ClickMoveCtxProvider } from "../contexts/ClickMoveCtx"
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
            <HouseCtxProvider gameId={gameId}>
              <StoragePileCtxProvider gameId={gameId}>
                <CenterPileCtxProvider gameId={gameId}>
                  <ClickMoveCtxProvider>
                    <ChatCtxProvider gameId={gameId}>
                      <SoundCtxProvider>
                        <SnackbarHandler gameId={gameId} />
                        <GamePage />
                        <GameSounds />
                        <GameContent />
                      </SoundCtxProvider>
                    </ChatCtxProvider>
                  </ClickMoveCtxProvider>
                </CenterPileCtxProvider>
              </StoragePileCtxProvider>
            </HouseCtxProvider>
          </PlayersCtxProvider>
        </TurnTimerCtxProvider>
      </PointsCtxProvider>
    </GameCtxProvider>
  )
}

export default Game
