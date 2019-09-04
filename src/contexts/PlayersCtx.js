import React, { createContext, useContext, useState, useEffect } from "react"
import { useGameCtx } from "./GameCtx"
import { useFirebase } from "./FirebaseCtx"

const PlayersCtx = createContext()

export const PlayersCtxProvider = props => {
  const { gameState } = useGameCtx()
  const [players, setPlayers] = useState({})
  const { firestore } = useFirebase()
  useEffect(() => {
    if (gameState && (gameState.memberUIDs || gameState.memberRequests)) {
      ;[...gameState.memberUIDs, ...gameState.memberRequests].forEach(uid => {
        const memberRef = firestore.collection("publicProfiles").doc(uid)
        memberRef.onSnapshot(doc => {
          setPlayers(old => ({ ...old, [doc.id]: doc.data() }))
        })
      })
    }
  }, [firestore, gameState, gameState.memberUIDs])

  return <PlayersCtx.Provider value={{ players }} {...props} />
}

export const usePlayersCtx = () => {
  const ctx = useContext(PlayersCtx)
  if (!ctx)
    throw new Error(
      "usePlayersCtx must be a descendant of PlayersCtxProvider 😕"
    )

  const { players } = ctx
  return { players }
}
