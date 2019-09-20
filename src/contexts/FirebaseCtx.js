import React, { createContext, useContext } from "react"
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
    doSendInvite,
    doDisInvite,
    doAcceptInvite,
    convertInviteToGame,
    removeGameInvitation,
    doCreateGameFromInvites,
    doCreateGame,
    doProposeGame,
    updateLastSeen,
    doRematch,
    doCancelGame,
    doRequestToJoinGame,
    doHandleGameRequest,
    doExitFromGame,
    doStartGame,
    doAddToLog,
    doRemoveLog,
    deleteGame,
    handleEndGame,
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

  return {
    doCreateUserWithEmailAndPassword,
    doSignInWithUserAndPassword,
    doSignOut,
    doSendInvite,
    doDisInvite,
    doAcceptInvite,
    convertInviteToGame,
    removeGameInvitation,
    doCreateGameFromInvites,
    doCreateGame,
    doProposeGame,
    updateLastSeen,
    doRematch,
    doCancelGame,
    doRequestToJoinGame,
    doHandleGameRequest,
    doExitFromGame,
    doStartGame,
    doAddToLog,
    doRemoveLog,
    deleteGame,
    handleEndGame,
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
