import React, { createContext, useContext, useState, useEffect } from "react"
import { useFirebase } from "./FirebaseCtx"
import moment from "moment"

const GamePlayCtx = createContext()

export const GamePlayCtxProvider = ({ gameId, ...props }) => {
  const [gamePlay, setGamePlayINSTATE] = useState({})
  const { fdb } = useFirebase()

  useEffect(() => {
    const setGamePlay = newState => {
      console.log("setting game play")
      setGamePlayINSTATE(newState)
    }
    const gamePlayRef = fdb.ref(`/currentGames/${gameId}`)
    gamePlayRef.on("value", snapshot => {
      console.log("snapshot update", snapshot.val(), moment().toISOString())
      const newValue = snapshot.val()
      setGamePlay(newValue)
    })
  }, [fdb, gameId])

  return <GamePlayCtx.Provider value={gamePlay} {...props} />
}

export const useGamePlayCtx = calledBy => {
  console.log("useGamePlayCtx called by", calledBy)
  const ctx = useContext(GamePlayCtx)
  if (!ctx)
    throw new Error(
      "useGamePlay must be a descendant of GamePlayCtxProvider 😕"
    )

  const { gamePlay } = ctx
  return { gamePlay }
}
