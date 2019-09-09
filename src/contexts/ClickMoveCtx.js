import React, { createContext, useContext, useReducer, useState } from "react"
import { useGameCtx } from "./GameCtx"
import { useAuthCtx } from "./AuthCtx"

const ClickMoveCtx = createContext()

export const ClickMoveCtxProvider = props => {
  const [draggingItemId, setDraggingItemId] = useState(null)
  return (
    <ClickMoveCtx.Provider
      value={{ draggingItemId, setDraggingItemId }}
      {...props}
    />
  )
}

export const useClickMoveCtx = () => {
  const ctx = useContext(ClickMoveCtx)
  const { gamePlay } = useGameCtx()
  const { user } = useAuthCtx()
  if (!ctx)
    throw new Error(
      "useClickMoveCtx must be a descendant of ClickMoveCtxProvider 😕 "
    )
  const { draggingItemId, setDraggingItemId } = ctx
  const toggleDraggingId = itemId => {
    const isMyTurn =
      gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid
    if (!isMyTurn && draggingItemId) setDraggingItemId(null)
    if (!isMyTurn) return null
    setDraggingItemId(old => (old ? null : itemId))
  }
  const cancelDraggingCard = () => {
    setDraggingItemId(null)
  }
  return { toggleDraggingId, draggingItemId, cancelDraggingCard }
}
