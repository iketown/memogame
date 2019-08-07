import React, { useContext, createContext } from "react"
import { useFirebase } from "./FirebaseCtx"
import { useAuthCtx } from "./AuthCtx"
import firebase from "firebase/app"

const FirestoreCtx = createContext()

export const FirestoreProvider = props => {
  const { app } = useFirebase()
  const { user } = useAuthCtx()
  const displayName = (user && user.displayName) || (user && user.email)
  const firestore = app.firestore()

  const createGame = ({ gameName }) => {
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

  const getGame = async gameId => {
    const gameRef = firestore.doc(`games/${gameId}`)
    const gameInfo = await gameRef
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data()
        } else {
          console.log("no such doc.")
        }
      })
      .catch(err => {
        console.log("error!", err)
      })
    return { gameRef, gameInfo }
  }

  // const requestJoinGame = async gameId => {
  //   console.log(`requesting ${user.email} to join game ${gameId}`)
  //   const { gameRef, gameInfo } = await getGame(gameId)
  //   if (!gameInfo.inProgress) {
  //     gameRef.update({
  //       memberRequests: firebase.firestore.FieldValue.arrayUnion({
  //         uid: user.uid,
  //         displayName
  //       })
  //     })
  //   } else {
  //     // handle this error in ui.  toaster?
  //     console.log("cant join this list")
  //   }
  // }

  return <FirestoreCtx.Provider value={{ firestore, createGame }} {...props} />
}

export const useFirestore = () => {
  const ctx = useContext(FirestoreCtx)
  if (!ctx)
    throw new Error("useFirestore must be a descendant of FirestoreProvider")
  const { firestore, createGame } = ctx
  return { firestore, createGame }
}
