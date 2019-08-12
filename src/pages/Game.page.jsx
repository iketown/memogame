import React from "react"
//
import { useAuthCtx } from "../contexts/AuthCtx"
import { GameCtxProvider } from "../contexts/GameCtx"
import GameContent from "../components/game/GameContent.jsx"
import { GamePlayCtxProvider } from "../contexts/GamePlayCtx.js"
//
//
const Game = props => {
  const { user } = useAuthCtx()
  const { gameId } = props.match.params

  if (!user) return <div>must sign in</div>
  if (!gameId) return <div>no game id</div>

  return (
    <GameCtxProvider gameId={gameId}>
      <GamePlayCtxProvider gameId={gameId}>
        <GameContent gameId={gameId} />
      </GamePlayCtxProvider>
    </GameCtxProvider>
  )
}

export default Game
