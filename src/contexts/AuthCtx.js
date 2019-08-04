import React, { useContext, createContext, useState, useMemo } from "react"
import { useFirebase } from "./FirebaseCtx"

const AuthCtx = createContext()

export const AuthCtxProvider = props => {
  const [user, setUser] = useState(null)
  const { auth } = useFirebase()
  auth.onAuthStateChanged(authUser => {
    setUser(authUser)
  })
  const value = useMemo(() => {
    return { user }
  }, [user])
  return <AuthCtx.Provider value={value} {...props} />
}

export const useAuthCtx = () => {
  const context = useContext(AuthCtx)
  if (!context)
    throw new Error("useAuthCtx must be a descendant of AuthCtxProvider 😕")
  const { user } = context
  return { user }
}
