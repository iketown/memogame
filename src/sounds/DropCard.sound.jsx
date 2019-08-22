import React from "react"
import Sound from "react-sound"
import dropCardContinue from "./dropCardContinue.mp3"

const DropCardSound = ({ playDropCardSound, setPlayDropCardSound }) => {
  return (
    <Sound
      url={dropCardContinue}
      playStatus={
        playDropCardSound ? Sound.status.PLAYING : Sound.status.STOPPED
      }
      onFinishedPlaying={() => setPlayDropCardSound(false)}
    />
  )
}

export default DropCardSound
