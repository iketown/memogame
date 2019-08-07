import React, { createContext, useContext, useEffect, useState } from "react"
import firebase from "firebase/app"
import { useFirestore } from "./FirestoreCtx"
import { useAuthCtx } from "./AuthCtx"

const GameCtx = createContext()

export const GameCtxProvider = props => {
  const { firestore } = useFirestore()
  const [gameState, setGameState] = useState({})
  const gameId = props.gameId
  useEffect(() => {
    const gameRef = firestore.doc(`/games/${gameId}`)
    gameRef.onSnapshot(doc => {
      const values = doc.data()
      setGameState(values)
    })
  }, [firestore, gameId])
  return (
    <GameCtx.Provider value={{ gameState, firestore, gameId }} {...props} />
  )
}

export const useGameCtx = () => {
  const ctx = useContext(GameCtx)
  const { user } = useAuthCtx()
  const displayName = (user && user.displayName) || (user && user.email)

  if (!ctx)
    throw new Error("useGameCtx must be a descendant of GameCtxProvider 😕")
  const { gameState, firestore, gameId } = ctx
  //
  const _getGame = async () => {
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
  //
  const requestJoinGame = async () => {
    console.log(`requesting ${user.email} to join game ${gameId}`)
    const { gameRef, gameInfo } = await _getGame()
    if (!gameInfo.inProgress) {
      gameRef.update({
        memberRequests: firebase.firestore.FieldValue.arrayUnion({
          uid: user.uid,
          displayName
        })
      })
    } else {
      // handle this error in ui.  toaster?
      console.log("cant join this list")
    }
  }
  const removeRequest = async () => {
    console.log(`removing ${user.email} from request list - ${gameId}`)
    const { gameRef, gameInfo } = await _getGame()
    gameRef.update({
      memberRequests: firebase.firestore.FieldValue.arrayRemove({
        uid: user.uid,
        displayName
      })
    })
  }

  const handleGameRequest = async ({ requestingUID, approvedBool }) => {
    const { gameRef, gameInfo } = await _getGame()
    if (gameInfo.startedBy !== user.uid) {
      console.log("not your game", gameInfo.startedBy, user.uid)
      return null
    }
    const requester = gameInfo.memberRequests.find(
      mem => mem.uid === requestingUID
    )
    if (!requester) return "sorry, person not found"

    // remove person from request list
    const newRequests = gameInfo.memberRequests.filter(
      mem => mem.uid !== requestingUID
    )
    // add person to members if approved
    const newMembers = [...gameInfo.members]
    if (approvedBool) {
      newMembers.push(requester)
    }
    gameRef.update({
      memberRequests: newRequests,
      members: newMembers
    })
  }
  return { gameState, requestJoinGame, removeRequest, handleGameRequest }
}
