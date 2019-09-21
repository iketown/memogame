import React, { useEffect, memo } from "react"
import { Button, Typography } from "@material-ui/core"
import moment from "moment"
import styled from "styled-components"
import isEqual from "lodash/isEqual"
//
import { useGamePlayCtx } from "../contexts/GamePlayCtx"
import { useDialogCtx } from "../contexts/DialogCtx"
import { useGameCtx } from "../contexts/GameCtx"
import { useGameFxnsLOC } from "../hooks/useGameFxnsLOC"
//
//
const GamePauseContainer = () => {
  const { gamePlay } = useGamePlayCtx()
  const { dispatch } = useDialogCtx()
  const whosTurnItIs = gamePlay && gamePlay.whosTurnItIs
  return <MemoGamePauser whosTurnItIs={whosTurnItIs} dispatch={dispatch} />
}

const FullScreenPaused = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 500;
  background-image: radial-gradient(#ffffffee 40%, #ffffff73);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const secondsBeforePause = 1000

const GamePauser = ({ whosTurnItIs }) => {
  const paused = whosTurnItIs && whosTurnItIs.gamePaused
  const { pauseGame, unpauseGame } = useGameFxnsLOC()
  const { gameState } = useGameCtx()
  useEffect(() => {
    if (
      whosTurnItIs &&
      gameState &&
      !gameState.completed &&
      gameState.inProgress
    ) {
      if (whosTurnItIs.lastCheckIn) {
        const secondsSinceLastCheckin =
          moment().diff(moment(whosTurnItIs.lastCheckIn)) / 1000
        if (secondsSinceLastCheckin > secondsBeforePause) pauseGame()
      } else {
        const secondsSinceTurnStarted =
          moment().diff(moment(whosTurnItIs.lastCheckIn)) / 1000
        if (secondsSinceTurnStarted > secondsBeforePause) pauseGame()
      }
    }
  }, [gameState, pauseGame, whosTurnItIs])
  return paused ? (
    <FullScreenPaused>
      <div>
        <Typography variant="subtitle1">game is paused</Typography>
      </div>
      <div>
        <Button variant="contained" color="primary" onClick={unpauseGame}>
          PLAY ►
        </Button>
      </div>
    </FullScreenPaused>
  ) : (
    <div />
  )
}

const MemoGamePauser = memo(GamePauser, sameProps)
function sameProps(prev, next) {
  const _equal = isEqual(prev.whosTurnItIs, next.whosTurnItIs)
  return _equal
}

export default GamePauseContainer

// const secondsSinceLastCheckin =
//       moment().diff(moment(whosTurnItIs.lastCheckIn)) / 1000
