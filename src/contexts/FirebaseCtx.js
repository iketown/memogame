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
    playStorageToCenter,
    playStorageToHouse,
    fdb,
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
