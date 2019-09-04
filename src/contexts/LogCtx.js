import React, { createContext, useContext, useState, useEffect } from "react"
import { useFirebase } from "./FirebaseCtx"
import { useAuthCtx } from "./AuthCtx"
import { useGameCtx, useCenterPileCtx } from "./GameCtx"
import { removeUid } from "../utils/imageUtils"
import { doItemsMatch } from "../utils/gameLogic"
import { useAllItemsCtx } from "./AllItemsCtx"
import { usePlayersCtx } from "./PlayersCtx"
const LogCtx = createContext()

export const LogCtxProvider = props => {
  const { fdb, doAddToLog } = useFirebase()
  const gameId = props.gameId
  const [log, setLog] = useState({})
  useEffect(() => {
    const gameLogRef = fdb.ref(`/currentGames/${gameId}/gameLog`)
    gameLogRef.on("value", snapshot => {
      setLog(snapshot.val() || {})
    })
    return gameLogRef.off
  }, [fdb, gameId])
  return (
    <LogCtx.Provider value={{ log, setLog, gameId, doAddToLog }} {...props} />
  )
}

export const useLogCtx = () => {
  const ctx = useContext(LogCtx)
  const { user } = useAuthCtx()
  const { players } = usePlayersCtx()
  const { itemFromItemId } = useAllItemsCtx()
  const { centerPile } = useCenterPileCtx()
  const {
    gameState: { members, gameId }
  } = useGameCtx()
  if (!ctx)
    throw new Error("useLogCtx must be a descendant of LogCtxProvider 😕")
  const { chat, setChat, doAddToLog } = ctx

  const addLogMessage = ({ itemId, destination }) => {
    // Frank puts Purple Eggplant on center
    // Henry moves card into house
    const name = user.displayName
    const itemName = itemFromItemId(itemId).name
    let text
    if (destination === "house") {
      text = `${name} puts ${itemName} in house`
    }
    if (destination === "center") {
      text = `${name} plays ${itemName}`
    }
    const topCardId = centerPile && centerPile[0]
    const valid =
      destination === "center" ? doItemsMatch(topCardId, itemId) : true
    // avatar link would be nice here.

    doAddToLog({
      gameId,
      uid: user.uid,
      player: players[user.uid],
      valid,
      text
    })
  }
  return { chat, setChat, addLogMessage }
}
