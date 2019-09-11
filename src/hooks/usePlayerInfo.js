import { useMemo, useState, useEffect } from "react"
import moment from "moment"
import { useGameCtx } from "../contexts/GameCtx"
import { usePlayersCtx } from "../contexts/PlayersCtx"
import { useOthersTurnTimer } from "./useTurnTimer"

//
//
export const useOtherPlayerInfo = playerId => {
  if (!playerId) throw new Error("useOtherPlayerInfo must be called with a uid")

  const { gamePlay } = useGameCtx()
  const { players } = usePlayersCtx()

  const publicProfile = useMemo(() => {
    return (players && players[playerId]) || {}
  }, [playerId, players])

  // const secondsLeft = useOthersTurnTimer({ playerId })
  const secondsLeft = 12
  const { points, storageCount, houseCount } = useMemo(() => {
    const playerState =
      gamePlay && gamePlay.gameStates && gamePlay.gameStates[playerId]
    if (!playerState) return { points: "?", storageCount: "?", houseCount: "?" }
    const points = playerState.points || 0
    const storageCount =
      (playerState.storagePile && playerState.storagePile.length) || 0
    const houseCount =
      (playerState &&
        playerState.house &&
        Object.values(playerState.house).reduce((sum, room) => {
          if (room.length) sum += room.length
          return sum
        }, 0)) ||
      0
    return { points, storageCount, houseCount }
  }, [gamePlay, playerId])

  return { points, storageCount, houseCount, secondsLeft, publicProfile }
}
