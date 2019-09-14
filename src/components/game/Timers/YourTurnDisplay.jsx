import React from "react"
import TurnTimer from "./TurnTimer.jsx"
import { useAuthCtx } from "../../../contexts/AuthCtx.js"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx.js"

const YourTurnDisplay = () => {
  const { user } = useAuthCtx()
  const { gamePlay } = useGamePlayCtx("YourTurnDisplay")
  const itsYourTurn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid

  return !itsYourTurn ? (
    <div />
  ) : (
    <div>
      <TurnTimer
        playerId={user.uid}
        render={({ getTime }) => {
          return (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1rem" }}>YOUR TURN</div>
              <p style={{ fontSize: "5rem", margin: "10px", color: "maroon" }}>
                {Math.floor(getTime() / 1000)}
              </p>
            </div>
          )
        }}
      />
    </div>
  )
}

export default YourTurnDisplay
