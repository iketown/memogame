import React, { createContext, useContext, useState, useEffect } from "react"
import { useFirebase } from "./FirebaseCtx"
import { useAuthCtx } from "./AuthCtx"

const ChatCtx = createContext()

export const ChatCtxProvider = props => {
  const { fdb } = useFirebase()
  const gameId = props.gameId
  const [chat, setChat] = useState([])
  useEffect(() => {
    const chatRef = fdb.ref(`/currentGames/${gameId}/chat`)
    chatRef.on("value", snapshot => {
      setChat(snapshot.val() || [])
    })
    return chatRef.off
  }, [fdb, gameId])
  return <ChatCtx.Provider value={{ chat, setChat, gameId }} {...props} />
}

export const useChatCtx = () => {
  const ctx = useContext(ChatCtx)
  const { user } = useAuthCtx()
  const { addToChat } = useFirebase()
  if (!ctx)
    throw new Error("useChatCtx must be a descendant of ChatCtxProvider 😕")
  const { chat, setChat, gameId } = ctx
  const timeStamp = new Date().toString()
  const addChatMessage = text => {
    addToChat({ gameId, text, timeStamp })
  }
  return { chat, setChat, addChatMessage }
}
