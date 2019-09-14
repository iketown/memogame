import React, { createContext, useContext, useState } from "react"
import { useAuthCtx } from "./AuthCtx"
import { useGameFxns } from "../hooks/useGameFxns"
import { useGamePlayCtx } from "./GamePlayCtx"

const ClickMoveCtx = createContext()

export const ClickMoveCtxProvider = props => {
  const [movingItem, setMovingItem] = useState(null)
  return (
    <ClickMoveCtx.Provider value={{ movingItem, setMovingItem }} {...props} />
  )
}

export const useClickMoveCtx = () => {
  const ctx = useContext(ClickMoveCtx)
  const { gamePlay } = useGamePlayCtx("useClickMoveCtx")
  const { user } = useAuthCtx()
  const { storageToHouseFX } = useGameFxns("useClickMoveCtx")
  if (!ctx)
    throw new Error(
      "useClickMoveCtx must be a descendant of ClickMoveCtxProvider 😕 "
    )
  const { movingItem, setMovingItem } = ctx
  const toggleMovingItem = ({ itemId, source }) => {
    const isMyTurn =
      gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid
    if (!isMyTurn && movingItem) setMovingItem(null)
    if (!isMyTurn) return null
    if (movingItem && movingItem.itemId === itemId) setMovingItem(null)
    else setMovingItem({ itemId, source })
  }
  const cancelMovingCard = () => {
    setMovingItem(null)
  }
  const clickHouseTarget = roomId => {
    console.log("moving to house", movingItem, roomId)
    storageToHouseFX({ roomId, itemId: movingItem.itemId })
    setMovingItem(null)
  }
  return {
    toggleMovingItem,
    clickHouseTarget,
    movingItem,
    cancelMovingCard
  }
}
