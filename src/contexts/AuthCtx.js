import React, {
  useContext,
  createContext,
  useState,
  useMemo,
  useEffect,
  useRef
} from "react"
import { useFirebase } from "./FirebaseCtx"
import { useCallCounter } from "../hooks/useCallCounter"

const AuthCtx = createContext()

export const AuthCtxProvider = props => {
  const [user, setUser] = useState(null)
  const [publicProfile, setPublicProfile] = useState(null)
  const { auth, firestore } = useFirebase()
  const { incrementCallCounter } = useCallCounter("AuthCtxProvider")
  const userId = useMemo(() => {
    return user && user.uid
  }, [user])

  const profileRef = useRef()
  useEffect(() => {
    // get publicProfile from firestore
    if (userId) {
      const myPublicProfileRef = firestore.doc(`/publicProfiles/${userId}`)
      if (!profileRef.current) {
        console.log("listener for public profile STARTING")
        profileRef.current = myPublicProfileRef.onSnapshot(doc => {
          if (doc.data()) {
            const _data = doc.data()
            incrementCallCounter()
            setPublicProfile(_data)
          }
        })
      } else {
        console.log("listener for public profile already exists")
      }
      return profileRef.current
    }
  }, [firestore, incrementCallCounter, publicProfile, userId])

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
