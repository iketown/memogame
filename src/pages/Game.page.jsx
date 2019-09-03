import React from "react"
//
import { useAuthCtx } from "../contexts/AuthCtx"
import {
  GameCtxProvider,
  HouseCtxProvider,
  CenterPileCtxProvider,
  StoragePileCtxProvider,
  PointsCtxProvider
} from "../contexts/GameCtx"
import { ChatCtxProvider } from "../contexts/ChatCtx"
import GameContent from "../components/game/GameContent.jsx"
import SnackbarHandler from "../components/SnackBarHandler.jsx"
import { GamePlayCtxProvider } from "../contexts/GamePlayCtx.js"
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
            <HouseCtxProvider gameId={gameId}>
              <StoragePileCtxProvider gameId={gameId}>
                <CenterPileCtxProvider gameId={gameId}>
                  <GamePlayCtxProvider gameId={gameId}>
                    <ChatCtxProvider gameId={gameId}>
                      <SnackbarHandler gameId={gameId} />
                      <GameContent gameId={gameId} />
                    </ChatCtxProvider>
                  </GamePlayCtxProvider>
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
