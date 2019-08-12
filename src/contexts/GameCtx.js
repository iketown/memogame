import React, { createContext, useContext, useEffect, useState } from "react"
import firebase from "firebase/app"
import { useFirestore } from "./FirestoreCtx"
import { useAuthCtx } from "./AuthCtx"
import { useFirebase } from "./FirebaseCtx"
import { useItemCtx } from "./ItemContext"
import { shuffle } from "../utils/gameLogic"

const GameCtx = createContext()

export const GameCtxProvider = props => {
  console.log("rendering game ctx provider")
  const { firestore } = useFirestore()
  const { fdb } = useFirebase()
  const { allItems } = useItemCtx()
  const { user } = useAuthCtx()
  const [gameState, setGameState] = useState({})
  const [gamePlay, setGamePlay] = useState({})
  const gameId = props.gameId
  useEffect(() => {
    const gameRef = firestore.doc(`/games/${gameId}`)
    gameRef.onSnapshot(doc => {
      const values = doc.data()
      setGameState(values)
    })
  }, [firestore, gameId])

  useEffect(() => {
    const gamePlayRef = fdb.ref(`/currentGames/${gameId}`)
    gamePlayRef.on("value", snapshot => {
      console.log("setting gameplay values")
      setGamePlay(snapshot.val())
    })
    return gamePlayRef.off
  }, [fdb, gameId])

  function randomListOfItemIds(uid) {
    const allIds = Object.keys(allItems).map(key => `${key}_${uid}`) // add uid to each person's cards so you know where they started, and so they stay unique
    shuffle(allIds)
    return allIds
  }
  function createRTDBGame() {
    const gamePlayRef = fdb.ref(`/currentGames/${gameId}`)
    const { gameName, startedBy, members } = gameState
    const allItemKeys = Object.keys(allItems)
    const randomItem =
      allItemKeys[Math.floor(allItemKeys.length * Math.random())]

    const gameStates = members.reduce((obj, member) => {
      const myFaceUpPile = randomListOfItemIds(member.uid)
      obj[member.uid] = {
        faceUpPile: myFaceUpPile,
        house: {
          bedroom: [false, false, false],
          bath: [false, false, false],
          garage: [false, false, false],
          kitchen: [false, false, false]
        }
      }
      return obj
    }, {})
    gamePlayRef.set({
      gameName,
      startedBy,
      members,
      whosTurnItIs: members[0],
      centerCardPile: [randomItem],
      gameStates
    })
  }
  return (
    <GameCtx.Provider
      value={{
        gameState,
        setGamePlay,
        gamePlay,
        firestore,
        gameId,
        createRTDBGame
      }}
      {...props}
    />
  )
}

export const useGameCtx = () => {
  const ctx = useContext(GameCtx)
  const { user } = useAuthCtx()
  const displayName = (user && user.displayName) || (user && user.email)

  if (!ctx)
    throw new Error("useGameCtx must be a descendant of GameCtxProvider 😕")
  const {
    gameState,
    setGamePlay,
    firestore,
    gameId,
    gamePlay,
    createRTDBGame
  } = ctx
  //
  const _getGameFirestore = async () => {
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
    const { gameRef, gameInfo } = await _getGameFirestore()
    if (!gameInfo.inProgress) {
      gameRef.update({
        memberRequests: firebase.firestore.FieldValue.arrayUnion({
          uid: user.uid,
          displayName
        })
      })
    } else {
      console.log("cant join this list")
    }
  }
  const removeRequest = async () => {
    console.log(`removing ${user.email} from request list - ${gameId}`)
    const { gameRef, gameInfo } = await _getGameFirestore()
    gameRef.update({
      memberRequests: firebase.firestore.FieldValue.arrayRemove({
        uid: user.uid,
        displayName
      })
    })
  }
  const setGameInProgress = async () => {
    const { gameRef } = await _getGameFirestore()
    gameRef.update({
      inProgress: true
    })
  }
  const openGameToNewPlayers = async () => {
    const { gameRef } = await _getGameFirestore()
    gameRef.update({
      inProgress: false
    })
  }
  const handleGameRequest = async ({ requestingUID, approvedBool }) => {
    const { gameRef, gameInfo } = await _getGameFirestore()
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

  return {
    gameState,
    setGamePlay,
    gamePlay,
    requestJoinGame,
    removeRequest,
    handleGameRequest,
    createRTDBGame,
    setGameInProgress,
    openGameToNewPlayers
  }
}
