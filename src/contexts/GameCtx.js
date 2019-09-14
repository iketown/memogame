import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback
} from "react"
import firebase from "firebase/app"
import moment from "moment"
import { useAuthCtx } from "./AuthCtx"
import { useFirebase } from "./FirebaseCtx"
import { shuffle } from "../utils/gameLogic"
import allItems from "../resources/allItems"

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
  console.log("houseCtxProvider called")
  const [selectedRoom, setSelectedRoom] = useState({
    roomId: "",
    faceUp: false
  })

  const { fdb } = useFirebase()
  const gameId = props.gameId
  const { user } = useAuthCtx()
  const [myHouse, setMyHouse] = useState({})

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
  const { myHouse, selectedRoom, setSelectedRoom } = ctx
  const cardsInMyHouse = useMemo(() => {
    const quantity = Object.values(myHouse).reduce((sum, room) => {
      sum += room.length
      return sum
    }, 0)
    return quantity
  }, [myHouse])

  return {
    myHouse,
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
  const [centerPile, setCenterPileInState] = useState([])
  const setCenterPile = useCallback(newState => {
    console.log("settingCenterPile state", newState)
    setCenterPileInState(newState)
  }, [])
  useEffect(() => {
    // keep CENTER PILE in sync with firebase
    const centerPileRef = fdb.ref(`/currentGames/${gameId}/centerCardPile`)
    centerPileRef.on("value", snapshot => {
      console.log("centerPileRef called")
      const oldState = JSON.stringify(centerPile)
      const newState = JSON.stringify(snapshot.val())
      if (snapshot.val() && oldState !== newState) {
        setCenterPile(snapshot.val() || [])
      } else {
        console.log("not gonna update centerPile")
      }
    })
  }, [centerPile, fdb, gameId, setCenterPile])
  return <CenterPileCtx.Provider value={{ centerPile }} {...props} />
}

export const useCenterPileCtx = () => {
  const ctx = useContext(CenterPileCtx)
  if (!ctx)
    throw new Error(
      "useCenterPileCtx must be a descendant of CenterPileCtxProvider 😕"
    )
  const { centerPile } = ctx

  return { centerPile }
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

  const { storagePile } = ctx
  return {
    storagePile
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

const GameCtx = createContext()
export const GameCtxProvider = props => {
  const { firestore } = useFirebase()
  const { fdb } = useFirebase()
  const [gameState, setGameStateR] = useState({})

  function setGameState(newState) {
    console.log("setting game state", newState)
    setGameStateR(newState)
  }
  const gameId = props.gameId

  useEffect(() => {
    const gameRef = firestore.doc(`/games/${gameId}`)
    gameRef.onSnapshot(doc => {
      console.log("new snapshot")
      const compareFirst = true
      const values = doc.data()
      if (compareFirst) {
        const newGameStateJson = JSON.stringify({ ...values, gameId })
        const oldStateJson = JSON.stringify(gameState)
        if (newGameStateJson !== oldStateJson) {
          console.log("update gameState")
          setGameState({ ...values, gameId })
        } else {
          console.log("not gonna update gameState")
        }
      } else {
        console.log("updating gameState")
        setGameState({ ...values, gameId })
      }
      // if (values) {
      //   setGameState({ ...values, gameId })
      // }
    })
  }, [firestore, gameId, gameState])

  const randomListOfItemIds = useCallback(uid => {
    const allIds = Object.keys(allItems).map(key => `${key}_${uid}`) // add uid to each person's cards so you know where they started, and so they stay unique
    const shuffledIds = shuffle(allIds)
    return shuffledIds
  }, [])

  const createRTDBGame = useCallback(() => {
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
  }, [fdb, gameId, gameState, randomListOfItemIds])

  // const totalCards = useMemo(() => {
  //   if (!gamePlay) return null
  //   // return null
  //   const centerCards = gamePlay.centerCardPile

  //   const storageCards =
  //     gamePlay.gameStates &&
  //     Object.values(gamePlay.gameStates).reduce((arr, state) => {
  //       if (state.storagePile) {
  //         arr.push(...state.storagePile)
  //       }
  //       return arr
  //     }, [])

  //   const houseCards =
  //     gamePlay.gameStates &&
  //     Object.values(gamePlay.gameStates).reduce((arr, state) => {
  //       if (state.house) {
  //         Object.values(state.house).forEach(room => arr.push(...room))
  //       }
  //       return arr
  //     }, [])
  //   if (gamePlay.gameStates) {
  //     Object.values(gamePlay.gameStates).forEach(gameState => {
  //       const { house, storagePile } = gameState
  //       if (house) {
  //         Object.values(house).forEach(room => {
  //           houseCards.concat(room)
  //         })
  //       }
  //       if (storagePile && storagePile.length) {
  //         storageCards.concat(...storagePile)
  //       }
  //     })
  //   }

  //   const center = (centerCards && centerCards.length) || 0
  //   const houses = (houseCards && houseCards.length) || 0
  //   const storage = (storageCards && storageCards.length) || 0
  //   return { center, houses, storage, total: center + houses + storage }
  // }, [])

  if (!gameId) return null
  return (
    <GameCtx.Provider
      value={{
        gameState,
        firestore,
        gameId,
        createRTDBGame
      }}
      {...props}
    />
  )
}

export const useGameCtx = byWho => {
  console.log("useGameCtx called by", byWho)
  const ctx = useContext(GameCtx)
  const { user } = useAuthCtx()
  const { firestore } = useFirebase()
  if (!ctx)
    throw new Error("useGameCtx must be a descendant of GameCtxProvider 😕")
  const { gameState, gameId, gamePlay, createRTDBGame, totalCards } = ctx
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
    const { gameRef } = await _getGameFirestore()
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
    const { gameRef } = await _getGameFirestore()
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
