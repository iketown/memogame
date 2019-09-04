import React, { useEffect } from "react"
import Sound from "react-sound"
import dropCardContinue from "./dropCardContinue.mp3"
import buzzWrong from "./buzz-wrong.mp3"
import { useGameFxns } from "../hooks/useGameFxns"
import { useSoundCtx } from "../contexts/GameCtx"

//
//
const DropCardSound = () => {
  const { playDropCardSound, cancelDropCardSound } = useSoundCtx()
  useEffect(() => {
    console.log("playDropCardSound in dropcardsound", playDropCardSound)
  }, [playDropCardSound])
  return (
    <>
      <Sound
        url={dropCardContinue}
        playStatus={
          playDropCardSound === "valid"
            ? Sound.status.PLAYING
            : Sound.status.STOPPED
        }
        onFinishedPlaying={cancelDropCardSound}
      />
      <Sound
        url={buzzWrong}
        playStatus={
          playDropCardSound === "invalid"
            ? Sound.status.PLAYING
            : Sound.status.STOPPED
        }
        volume={50}
        onFinishedPlaying={cancelDropCardSound}
      />
    </>
  )
}

export default DropCardSound
