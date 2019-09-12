import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef
} from "react"
import firebase from "firebase/app"
import moment from "moment"
import { useAuthCtx } from "./AuthCtx"
import { useFirebase } from "./FirebaseCtx"
import { shuffle, doItemsMatch } from "../utils/gameLogic"
import allItems from "../resources/allItems"

const GameCtx = createContext()

// ⭐ 🌟 SOUNDS CONTEXT 🌟 ⭐ //

const SoundCtx = createContext()
export const SoundCtxProvider = props => {
  const [playDropCardSound, setPlayDropCardSound] = useState(false)

  return (
    <SoundCtx.Provider
      value={{ playDropCardSound, setPlayDropCardSound }}
      {...props}
    />
  )
}
export const useSoundCtx = () => {
  const ctx = useContext(SoundCtx)
  if (!ctx)
    throw new Error("useSoundCtx must be a descendant of SoundCtxProvider 😕")
  const { playDropCardSound, setPlayDropCardSound } = ctx
  const dropCardSound = ({ valid }) => {
    setPlayDropCardSound(valid ? "valid" : "invalid")
  }
  const cancelDropCardSound = () => {
    setPlayDropCardSound(false)
  }

  return { dropCardSound, cancelDropCardSound, playDropCardSound }
}
// ⭐ 🌟 END SOUNDS CONTEXT 🌟 ⭐ //

// ⭐ 🌟 HOUSE CONTEXT 🌟 ⭐ //
const HouseCtx = createContext()
export const HouseCtxProvider = props => {
  const [selectedRoom, setSelectedRoom] = useState({
    roomId: "",
    faceUp: false
  })

  const { fdb } = useFirebase()
  const gameId = props.gameId
  const { user } = useAuthCtx()
  const [myHouse, setMyHouse] = useState({})
  const [myHouseTimer, setMyHouseTimer] = useState({})
  // myHouseTimer formatted as  [itemId]: moment().toISOString()
  useEffect(() => {
    const myHouseRef = fdb.ref(
      `/currentGames/${gameId}/gameStates/${user.uid}/house`
    )
    // keep MY HOUSE in sync with firebase
    myHouseRef.on("value", snapshot => {
      setMyHouse(snapshot.val() || {})
    })
    // return myHouseRef.off
  }, [fdb, gameId, user, user.uid])
  return (
    <HouseCtx.Provider
      value={{
        myHouse,
        myHouseTimer,
        setMyHouseTimer,
        selectedRoom,
        setSelectedRoom
      }}
      {...props}
    />
  )
}
export const useHouseCtx = () => {
  const ctx = useContext(HouseCtx)
  if (!ctx)
    throw new Error("useHouseCtx must be a descendant of HouseCtxProvider 😕")
  const {
    myHouse,
    myHouseTimer,
    setMyHouseTimer,
    selectedRoom,
    setSelectedRoom
  } = ctx
  const cardsInMyHouse = useMemo(() => {
    const quantity = Object.values(myHouse).reduce((sum, room) => {
      sum += room.length
      return sum
    }, 0)
    return quantity
  }, [myHouse])

  // card must be in house for x seconds before it can be played.
  const houseRestrictionSeconds = 15

  const houseTimeoutRef = useRef()
  const addToHouseTimer = itemId => {
    // key is itemId
    // value is when the timer restriction is over.
    setMyHouseTimer(old => ({
      ...old,
      [itemId]: moment()
        .add(houseRestrictionSeconds, "seconds")
        .endOf("second")
    }))
    clearTimeout(houseTimeoutRef.current)
    houseTimeoutRef.current = setTimeout(
      () => removeFromHouseTimer(itemId),
      houseRestrictionSeconds * 1000
    )
  }
  const removeFromHouseTimer = itemId => {
    console.log("remove from h t called", itemId)
    setMyHouseTimer(old => {
      const newObj = { ...old }
      delete newObj[itemId]
      return newObj
    })
  }

  return {
    myHouse,
    myHouseTimer,
    addToHouseTimer,
    cardsInMyHouse,
    selectedRoom,
    setSelectedRoom
  }
}
// ⭐ 🌟 end HOUSE CONTEXT 🌟 ⭐ //

//

// ⭐ 🌟 CENTER PILE CONTEXT 🌟 ⭐ //
const CenterPileCtx = createContext()

export const CenterPileCtxProvider = props => {
  const { fdb } = useFirebase()
  const gameId = props.gameId
  const [centerPile, setCenterPile] = useState([])
  useEffect(() => {
    // keep CENTER PILE in sync with firebase
    const centerPileRef = fdb.ref(`/currentGames/${gameId}/centerCardPile`)
    centerPileRef.on("value", snapshot => {
      setCenterPile(snapshot.val() || [])
    })
    // return centerPileRef.off
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
    // return storagePileRef.off
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

// ⭐ 🌟 POINTS CONTEXT 🌟 ⭐ //
const PointsCtx = createContext()
export const PointsCtxProvider = props => {
  // points display is the momentary number that shows
  // when a valid card is laid down.  (it turns itself back to false)
  const [pointsDisplay, setPointsDisplay] = useState(false)
  // pointsClimber keeps track of how many points the next card is worth (if you play consecutive cards from house, each value is 1 more than the previous)
  const [pointsClimber, setPointsClimber] = useState(1)

  return (
    <PointsCtx.Provider
      value={{
        pointsDisplay,
        setPointsDisplay,
        pointsClimber,
        setPointsClimber
      }}
      {...props}
    />
  )
}
export const usePointsCtx = () => {
  const ctx = useContext(PointsCtx)
  if (!ctx) throw new Error("usePointsCtx must be a descendant of PointsCtx 😕")
  const {
    pointsDisplay,
    setPointsDisplay,
    pointsClimber,
    setPointsClimber
  } = ctx
  const incrementPointsClimber = () => {
    setPointsClimber(old => old + 1)
  }
  const resetPointsClimber = () => {
    setPointsClimber(1)
  }
  return {
    pointsDisplay,
    setPointsDisplay,
    pointsClimber,
    incrementPointsClimber,
    resetPointsClimber
  }
}
// ⭐ 🌟 END POINTS CONTEXT 🌟 ⭐ //

export const GameCtxProvider = props => {
  const { firestore } = useFirebase()
  const { user } = useAuthCtx()
  const { fdb } = useFirebase()
  const [gameState, setGameState] = useState({})
  const [gamePlay, setGamePlay] = useState({})

  const gameId = props.gameId

  useEffect(() => {
    const gameRef = firestore.doc(`/games/${gameId}`)
    const unsubscribe = gameRef.onSnapshot(doc => {
      const values = doc.data()
      if (values) {
        setGameState({ ...values, gameId })
      }
    })
    // return unsubscribe
  }, [firestore, gameId])

  useEffect(() => {
    const gamePlayRef = fdb.ref(`/currentGames/${gameId}`)
    gamePlayRef.on("value", snapshot => {
      setGamePlay(snapshot.val())
    })
    // return gamePlayRef.off
  }, [fdb, gameId])

  function randomListOfItemIds(uid) {
    const allIds = Object.keys(allItems).map(key => `${key}_${uid}`) // add uid to each person's cards so you know where they started, and so they stay unique
    shuffle(allIds)
    return allIds
  }
  function createRTDBGame() {
    const gamePlayRef = fdb.ref(`/currentGames/${gameId}`)
    const { gameName, startedBy, memberUIDs } = gameState

    const gameStates = memberUIDs.reduce((obj, uid) => {
      const storagePile = randomListOfItemIds(uid)
      obj[uid] = {
        storagePile,
        house: {}
      }
      return obj
    }, {})
    gamePlayRef.set({
      gameName,
      startedBy,
      memberUIDs,
      whosTurnItIs: { uid: memberUIDs[0], startTime: moment().toISOString() },
      centerPile: [],
      gameStates
    })
  }

  const totalCards = useMemo(() => {
    if (!gamePlay) return null
    // return null
    const centerCards = gamePlay.centerCardPile

    const storageCards =
      gamePlay.gameStates &&
      Object.values(gamePlay.gameStates).reduce((arr, state) => {
        if (state.storagePile) {
          arr.push(...state.storagePile)
        }
        return arr
      }, [])

    const houseCards =
      gamePlay.gameStates &&
      Object.values(gamePlay.gameStates).reduce((arr, state) => {
        if (state.house) {
          Object.values(state.house).forEach(room => arr.push(...room))
        }
        return arr
      }, [])
    if (gamePlay.gameStates) {
      Object.values(gamePlay.gameStates).forEach(gameState => {
        const { house, storagePile } = gameState
        if (house) {
          Object.values(house).forEach(room => {
            houseCards.concat(room)
          })
        }
        if (storagePile && storagePile.length) {
          storageCards.concat(...storagePile)
        }
      })
    }

    const center = (centerCards && centerCards.length) || 0
    const houses = (houseCards && houseCards.length) || 0
    const storage = (storageCards && storageCards.length) || 0
    return { center, houses, storage, total: center + houses + storage }
  }, [gamePlay])
  if (!gameId) return null
  return (
    <GameCtx.Provider
      value={{
        gameState,
        setGamePlay,
        gamePlay,
        firestore,
        gameId,
        createRTDBGame,
        totalCards
      }}
      {...props}
    />
  )
}

export const useGameCtx = () => {
  const ctx = useContext(GameCtx)
  const { user } = useAuthCtx()
  const { firestore } = useFirebase()
  if (!ctx)
    throw new Error("useGameCtx must be a descendant of GameCtxProvider 😕")
  const {
    gameState,
    setGamePlay,
    gameId,
    gamePlay,
    createRTDBGame,
    totalCards
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
        memberRequests: firebase.firestore.FieldValue.arrayUnion(user.uid)
      })
    } else {
      console.log("cant join this list")
    }
  }
  const removeRequest = async () => {
    console.log(`removing ${user.email} from request list - ${gameId}`)
    const { gameRef, gameInfo } = await _getGameFirestore()
    gameRef.update({
      memberRequests: firebase.firestore.FieldValue.arrayRemove(user.uid)
    })
  }
  const setGameInProgress = async () => {
    const { gameRef } = await _getGameFirestore()
    const startedAt = moment().toISOString()
    gameRef.update({
      inProgress: true,
      startedAt
    })
  }
  const openGameToNewPlayers = async () => {
    const { gameRef } = await _getGameFirestore()
    gameRef.update({
      inProgress: false
    })
  }
  const removeFromGame = async ({ uid }) => {
    const { gameRef, gameInfo } = await _getGameFirestore()
    const newMemberRequests = [...gameInfo.memberRequests, uid]
    const newMemberUIDs = gameInfo.memberUIDs.filter(_uid => _uid !== uid)
    return gameRef.update({
      memberRequests: newMemberRequests,
      memberUIDs: newMemberUIDs
    })
  }
  const changeGameParameter = async ({ key, value }) => {
    const { gameRef, gameInfo } = await _getGameFirestore()
    gameRef.update({ [key]: value })
  }
  const handleGameRequest = async ({ requestingUID, approvedBool }) => {
    const { gameRef, gameInfo } = await _getGameFirestore()
    if (gameInfo.startedBy !== user.uid) {
      console.log("not your game", gameInfo.startedBy, user.uid)
      return null
    }
    const requester = gameInfo.memberRequests.find(uid => uid === requestingUID)
    if (!requester) {
      console.log("person not found")
      return "sorry, person not found"
    }

    // remove person from request list
    const newRequests = gameInfo.memberRequests.filter(
      uid => uid !== requestingUID
    )
    // add person to members if approved
    // const newMembers = [...gameInfo.members]
    const newMemberUIDs = [...gameInfo.memberUIDs]
    if (approvedBool) {
      // newMembers.push(requester)
      newMemberUIDs.push(requestingUID)
    }
    gameRef.update({
      memberRequests: newRequests,
      // members: newMembers,
      memberUIDs: newMemberUIDs
    })
  }

  return {
    gameState,
    setGamePlay,
    gamePlay,
    gameId,
    requestJoinGame,
    removeRequest,
    handleGameRequest,
    removeFromGame,
    createRTDBGame,
    setGameInProgress,
    openGameToNewPlayers,
    totalCards,
    changeGameParameter
  }
}
