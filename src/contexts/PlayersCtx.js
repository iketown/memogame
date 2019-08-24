import React, { createContext, useContext, useState } from "react"
import { useGameCtx } from "./GameCtx"
import { useFirebase } from "./FirebaseCtx"

const PlayersCtx = createContext()

export const PlayersCtxProvider = props => {
  const { gamePlay } = useGameCtx()
  const { firestore } = useFirebase()
  const [playerData, setPlayerData] = useState(null)
  const playersRef = firestore.collection("publicProfiles")
  playersRef.onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
      console.log("doc data", doc.data())
    })
  })
  return <PlayersCtx.Provider value={{ playerData }} {...props} />
}

export const usePlayersCtx = () => {
  const ctx = useContext(PlayersCtx)
  if (!ctx)
    throw new Error(
      "usePlayersCtx must be a descendant of PlayersCtxProvider 😕"
    )

  const { playerData } = ctx
  return { playerData }
}
