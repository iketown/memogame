import React, {
  useContext,
  createContext,
  useState,
  useMemo,
  useEffect
} from "react"
import { useFirebase } from "./FirebaseCtx"

const AuthCtx = createContext()

export const AuthCtxProvider = props => {
  const [user, setUser] = useState(null)
  const [publicProfile, setPublicProfile] = useState(null)
  const { auth, firestore } = useFirebase()

  useEffect(() => {
    // get publicProfile from firestore
    if (user) {
      const myPublicProfileRef = firestore.doc(`/publicProfiles/${user.uid}`)
      const unsubscribe = myPublicProfileRef.onSnapshot(doc => {
        if (doc.data()) {
          console.log("public profile info", doc.data())
          setPublicProfile(doc.data())
        } else {
          console.log("no public profile for ", user)
        }
      })
      return unsubscribe
    }
  }, [firestore, user])
  auth.onAuthStateChanged(authUser => {
    if (authUser) {
      setUser(authUser)
    } else {
      setUser(null)
    }
  })

  return <AuthCtx.Provider value={{ user, publicProfile }} {...props} />
}

export const useAuthCtx = () => {
  const context = useContext(AuthCtx)
  if (!context)
    throw new Error("useAuthCtx must be a descendant of AuthCtxProvider 😕")
  const { user, publicProfile } = context
  return { user, publicProfile }
}
