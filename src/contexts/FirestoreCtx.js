import React, { useContext, createContext } from "react"
import { useFirebase } from "./FirebaseCtx"
import { useAuthCtx } from "./AuthCtx"
import firebase from "firebase/app"
const FirestoreCtx = createContext()

// all this does is create a game.  probably don't need this firestore ctx becuase firestore is now availble on the firebaseCtx

export const FirestoreProvider = props => {
  const { app } = useFirebase()
  const { user } = useAuthCtx()
  const displayName = (user && user.displayName) || (user && user.email)
  const firestore = app.firestore()

  // if (user) {
  //   const profileRef = firestore.doc(`users/${user.uid}`)
  //   profileRef.onSnapshot(doc => {
  //     console.log("current firestore data", doc.data())
  //   })
  // }
  const createGame = ({ gameName }) => {
    if (!user) {
      console.log("trying to create a game when not signed in")
      return null
    }

    const gamesRef = firestore.collection("games")
    return gamesRef.add({
      gameName,
      members: [{ uid: user.uid, displayName }],
      memberRequests: [],
      guestList: [],
      startedBy: user.uid,
      inProgress: false
    })
  }

  return <FirestoreCtx.Provider value={{ firestore, createGame }} {...props} />
}

export const useFirestore = () => {
  const ctx = useContext(FirestoreCtx)
  if (!ctx)
    throw new Error("useFirestore must be a descendant of FirestoreProvider")
  const { firestore, createGame } = ctx
  return { firestore, createGame }
}
