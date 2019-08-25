import React, { createContext, useContext } from "react"

const GameFxnCtx = createContext()

const GameFxnCtxProvider = props => {
  const value = {}
  return <GameFxnCtx.Provider value={value} {...props} />
}

const useGameFxnCtx = () => {
  const ctx = useContext()
  if (!ctx)
    throw new Error(
      "useGameFxnCtx must be a descendant of GameFxnCtxProvider 😕"
    )
  return ctx
}
