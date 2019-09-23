import React, { useState, useEffect, useRef, memo } from "react"
import Sound from "react-sound"

import startTurn from "./startTurn.mp3"
import endTurn from "./endTurn.mp3"
import winGame from "./winGame.mp3"
import loseGame from "./loseGame.mp3"

import { useAuthCtx } from "../contexts/AuthCtx"
import { useGamePlayCtx } from "../contexts/GamePlayCtx"
//
//
const YourTurnSoundContainer = () => {
  const { gamePlay } = useGamePlayCtx("YourTurnSound")
  const whosTurnUid =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid
  return <MemoYourTurnSound whosTurnUid={whosTurnUid} />
}

const YourTurnSound = ({ whosTurnUid }) => {
  const { user } = useAuthCtx()
  const whosTurn = useRef(false)

  const [soundToPlay, setSoundToPlay] = useState(false)

  useEffect(() => {
    if (whosTurnUid) {
      const newWhosTurn = whosTurnUid
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
  }, [user.uid, whosTurnUid])

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

      {/* <Sound
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
      /> */}
    </>
  )
}

const MemoYourTurnSound = memo(YourTurnSound, propsEqual)
function propsEqual(prev, next) {
  return false
}

export default YourTurnSoundContainer
