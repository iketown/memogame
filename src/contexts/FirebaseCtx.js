import React, { createContext, useContext, useState } from "react"
import Firebase from "../firebase/firebaseInit"

const FirebaseCtx = createContext()

export const FirebaseCtxProvider = props => {
  return <FirebaseCtx.Provider value={new Firebase()} {...props} />
}

export const useFirebase = () => {
  const ctx = useContext(FirebaseCtx)
  if (!ctx)
    throw new Error("useFirebase must be a descendant of FirebaseCtxProvider")
  const {
    doCreateUserWithEmailAndPassword,
    doSignInWithUserAndPassword,
    doSignOut,
    doCreateGame,
    doCancelGame,
    doRequestToJoinGame,
    doHandleGameRequest,
    doExitFromGame,
    doStartGame,
    doAddToLog,
    doRemoveLog,
    playStorageToCenter,
    playStorageToHouse,
    fdb,
    firestore,
    // fsdb,
    auth,
    fxns,
    playCard,
    endTurn,
    changeHouse,
    user,
    app,
    storageToCenter,
    storageToHouse,
    houseToCenter,
    houseToHouse
  } = ctx

  const createGame = ({ gameName }) => {
    const user = auth.currentUser
    if (!user) {
      console.log("trying to create a game when not signed in")
      return null
    }
    const displayName = (user && user.displayName) || (user && user.email)
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

  return {
    doCreateUserWithEmailAndPassword,
    doSignInWithUserAndPassword,
    doSignOut,
    doCreateGame,
    doCancelGame,
    doRequestToJoinGame,
    doHandleGameRequest,
    doExitFromGame,
    doStartGame,
    doAddToLog,
    doRemoveLog,
    createGame,
    playStorageToCenter,
    playStorageToHouse,
    fdb,
    firestore,
    // fsdb,
    auth,
    fxns,
    playCard,
    endTurn,
    changeHouse,
    user,
    app,
    storageToCenter,
    storageToHouse,
    houseToCenter,
    houseToHouse
  }
}
