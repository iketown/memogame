import React, { useEffect } from "react"
import YourTurnSound from "./YourTurn.sound.jsx"
import DropCardSound from "./DropCard.sound.jsx"

const GameSounds = () => {
  useEffect(() => {
    window.soundManager && window.soundManager.setup({ debugMode: false })
  }, [])

  return (
    <div>
      <YourTurnSound />
      <DropCardSound />
    </div>
  )
}

export default GameSounds
