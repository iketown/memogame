import React, { useContext, createContext, useState, useMemo } from "react"
import { useFirebase } from "./FirebaseCtx"

const AuthCtx = createContext()

export const AuthCtxProvider = props => {
  const [user, setUser] = useState(null)
  const [displayName, setDisplayName] = useState("")
  const { auth } = useFirebase()
  auth.onAuthStateChanged(authUser => {
    const _displayName = authUser ? authUser.displayName || authUser.email : ""
    setDisplayName(_displayName)
    setUser(authUser)
  })

  return <AuthCtx.Provider value={{ user, displayName }} {...props} />
}

export const useAuthCtx = () => {
  const context = useContext(AuthCtx)
  if (!context)
    throw new Error("useAuthCtx must be a descendant of AuthCtxProvider 😕")
  const { user, displayName } = context
  return { user, displayName }
}
