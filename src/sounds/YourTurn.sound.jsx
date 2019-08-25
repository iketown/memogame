import React, { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@material-ui/core"
import Sound from "react-sound"

import startTurn from "./startTurn.mp3"
import endTurn from "./endTurn.mp3"
import winGame from "./winGame.mp3"
import loseGame from "./loseGame.mp3"

import { useAuthCtx } from "../contexts/AuthCtx"
import { useGameCtx } from "../contexts/GameCtx"
//
//
const YourTurnSound = () => {
  const { user } = useAuthCtx()
  const { gamePlay } = useGameCtx()
  const whosTurn = useRef(false)

  const [soundToPlay, setSoundToPlay] = useState(false)

  useEffect(() => {
    if (gamePlay && !!gamePlay.whosTurnItIs) {
      const newWhosTurn = gamePlay.whosTurnItIs.uid
      if (newWhosTurn !== whosTurn.current) {
        // the turn has changed
        if (newWhosTurn === user.uid) {
          // my turn just started
          setSoundToPlay("startTurn")
        }
        if (whosTurn.current === user.uid && newWhosTurn !== user.uid) {
          // my turn just ended
          setSoundToPlay("endTurn")
        }
        whosTurn.current = newWhosTurn //
      }
    }
  }, [gamePlay, user.uid])

  return (
    <>
      <Sound
        url={startTurn}
        playStatus={
          soundToPlay === "startTurn"
            ? Sound.status.PLAYING
            : Sound.status.STOPPED
        }
        onFinishedPlaying={() => setSoundToPlay(false)}
      />
      <Sound
        url={endTurn}
        playStatus={
          soundToPlay === "endTurn"
            ? Sound.status.PLAYING
            : Sound.status.STOPPED
        }
        onFinishedPlaying={() => setSoundToPlay(false)}
      />

      <Sound
        url={winGame}
        playStatus={
          soundToPlay === "winGame"
            ? Sound.status.PLAYING
            : Sound.status.STOPPED
        }
        onFinishedPlaying={() => setSoundToPlay(false)}
      />
      <Sound
        url={loseGame}
        playStatus={
          soundToPlay === "loseGame"
            ? Sound.status.PLAYING
            : Sound.status.STOPPED
        }
        onFinishedPlaying={() => setSoundToPlay(false)}
      />
      {/* <Button onClick={() => setSoundToPlay("startTurn")}>
        play start turn
      </Button>
      <Button onClick={() => setSoundToPlay("endTurn")}>end turn</Button>
      <Button onClick={() => setSoundToPlay("winGame")}>win</Button>
      <Button onClick={() => setSoundToPlay("loseGame")}>lose</Button> */}
    </>
  )
}

export default YourTurnSound
