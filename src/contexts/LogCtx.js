import React, { createContext, useContext, useState, useEffect } from "react"
import { useFirebase } from "./FirebaseCtx"
import { useAuthCtx } from "./AuthCtx"
import { useGameCtx, useCenterPileCtx } from "./GameCtx"
import { removeUid } from "../utils/imageUtils"
import { doItemsMatch } from "../utils/gameLogic"
import { useAllItemsCtx } from "./AllItemsCtx"
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
  const { allItems } = useAllItemsCtx()
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
    const topCardId = centerPile && centerPile[0]
    const valid =
      destination === "center" ? doItemsMatch(topCardId, itemId) : true
    const member = members.find(mem => mem.uid === user.uid)
    // avatar link would be nice here.
    const itemName = itemId ? allItems[removeUid(itemId)].name : "card"
    const text = `${member.displayName} puts ${itemName} ${
      itemId ? "on" : "into"
    } ${destination}`
    console.log("logText", text)
    doAddToLog({ text, gameId, uid: user.uid, valid, destination, itemId })
  }
  return { chat, setChat, addLogMessage }
}
