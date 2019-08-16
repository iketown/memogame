import React, { createContext, useContext, useEffect, useState } from "react"
import firebase from "firebase/app"
import { useFirestore } from "./FirestoreCtx"
import { useAuthCtx } from "./AuthCtx"
import { useFirebase } from "./FirebaseCtx"
import { useItemCtx } from "./ItemContext"
import { shuffle, doItemsMatch } from "../utils/gameLogic"

const GameCtx = createContext()

// ⭐ 🌟 HOUSE CONTEXT 🌟 ⭐ //
const HouseCtx = createContext()
export const HouseCtxProvider = props => {
  const { fdb } = useFirebase()
  const gameId = props.gameId
  const { user } = useAuthCtx()
  const [myHouse, setMyHouse] = useState({})
  useEffect(() => {
    // keep MY HOUSE in sync with firebase
    const myHouseRef = fdb.ref(
      `/currentGames/${gameId}/gameStates/${user.uid}/house`
    )
    myHouseRef.on("value", snapshot => {
      setMyHouse(snapshot.val() || {})
    })
    return myHouseRef.off
  }, [fdb, gameId, user.uid])
  return <HouseCtx.Provider value={{ myHouse, setMyHouse }} {...props} />
}
export const useHouseCtx = () => {
  const ctx = useContext(HouseCtx)
  if (!ctx)
    throw new Error("useHouseCtx must be a descendant of HouseCtxProvider 😕")
  const { myHouse, setMyHouse } = ctx
  const addToRoomLocal = ({ roomId, itemId }) => {
    setMyHouse(old => {
      const newRoom = old[roomId] ? [itemId, ...old[roomId]] : [itemId]
      return { ...old, [roomId]: newRoom }
    })
  }
  const removeFromRoomLocal = ({ roomId, itemId }) => {
    setMyHouse(old => ({
      ...old,
      [roomId]: [...old[roomId].filter(_itemId => _itemId !== itemId)]
    }))
  }
  const reorderRoomLocal = ({ itemId, roomId, sourceIndex, destIndex }) => {
    setMyHouse(old => {
      if (!old[roomId]) return old
      const newRoom = [...old[roomId]]
      const [movingId] = newRoom.splice(sourceIndex, 1)
      if (movingId !== itemId) {
        console.log("these should match!", movingId, itemId)
        return old
      }
      newRoom.splice(destIndex, 0, movingId)
      return { ...old, [roomId]: newRoom }
    })
  }
  return {
    myHouse,
    setMyHouse,
    addToRoomLocal,
    removeFromRoomLocal,
    reorderRoomLocal
  }
}
// ⭐ 🌟 end HOUSE CONTEXT 🌟 ⭐ //

//

// ⭐ 🌟 CENTER PILE CONTEXT 🌟 ⭐ //
const CenterPileCtx = createContext()

export const CenterPileCtxProvider = props => {
  const { fdb } = useFirebase()
  const gameId = props.gameId
  const { user } = useAuthCtx()
  const [centerPile, setCenterPile] = useState([])
  useEffect(() => {
    // keep CENTER PILE in sync with firebase
    const centerPileRef = fdb.ref(`/currentGames/${gameId}/centerCardPile`)
    centerPileRef.on("value", snapshot => {
      setCenterPile(snapshot.val() || [])
    })
    return centerPileRef.off
  }, [fdb, gameId])
  return (
    <CenterPileCtx.Provider value={{ centerPile, setCenterPile }} {...props} />
  )
}

export const useCenterPileCtx = () => {
  const ctx = useContext(CenterPileCtx)
  const { addPileToStorageLocal } = useStoragePileCtx()
  if (!ctx)
    throw new Error(
      "useCenterPileCtx must be a descendant of CenterPileCtxProvider 😕"
    )
  const { centerPile, setCenterPile } = ctx

  const addToCenterLocal = ({ itemId }) => {
    const topCardId = centerPile[0]
    const validPlay = doItemsMatch(topCardId, itemId)
    if (validPlay) {
      setCenterPile(old => [itemId, ...old])
    } else {
      //handle invalid
      const oldCenterPile = [...centerPile] // to avoid race condition below
      addPileToStorageLocal(oldCenterPile)
      setCenterPile([itemId])
    }
  }
  return { centerPile, setCenterPile, addToCenterLocal }
}
// ⭐ 🌟 end CENTER PILE CONTEXT 🌟 ⭐ //

//

// ⭐ 🌟 STORAGE PILE CONTEXT 🌟 ⭐ //
const StoragePileCtx = createContext()
export const StoragePileCtxProvider = props => {
  const { fdb } = useFirebase()
  const gameId = props.gameId
  const { user } = useAuthCtx()
  const [storagePile, setStoragePile] = useState([])
  useEffect(() => {
    // keep STORAGE PILE in sync with firebase
    const storagePileRef = fdb.ref(
      `/currentGames/${gameId}/gameStates/${user.uid}/storagePile`
    )
    storagePileRef.on("value", snapshot => {
      if (snapshot.val()) setStoragePile(snapshot.val())
      else setStoragePile([])
    })
    return storagePileRef.off
  }, [fdb, gameId, user.uid])
  return (
    <StoragePileCtx.Provider
      value={{ storagePile, setStoragePile }}
      {...props}
    />
  )
}

export const useStoragePileCtx = () => {
  const ctx = useContext(StoragePileCtx)
  if (!ctx)
    throw new Error(
      "useStoragePileCtx must be a descendant of StoragePileCtxProvider 😕"
    )
  const removeFromStorageLocal = itemId => {
    setStoragePile(old => [...old].filter(_item => _item !== itemId))
  }
  const addPileToStorageLocal = itemArr => {
    setStoragePile(old => [...itemArr, ...old])
  }
  const { storagePile, setStoragePile } = ctx
  return {
    storagePile,
    setStoragePile,
    removeFromStorageLocal,
    addPileToStorageLocal
  }
}
// ⭐ 🌟 end STORAGE PILE CONTEXT 🌟 ⭐ //

export const GameCtxProvider = props => {
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
      setGameState({ ...values, gameId })
    })
  }, [firestore, gameId])

  // full game state (split this up)
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
      const storagePile = randomListOfItemIds(member.uid)
      obj[member.uid] = {
        storagePile,
        house: {
          attic: [],
          bedroom: [],
          bath: [],
          family: [],
          kitchen: [],
          cellar: []
        }
      }
      return obj
    }, {})
    gamePlayRef.set({
      gameName,
      startedBy,
      members,
      whosTurnItIs: members[0],
      centerPile: [],
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
