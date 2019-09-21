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
import { useGamePlayCtx } from "./GamePlayCtx"

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

//

//

// ⭐ 🌟 STORAGE PILE CONTEXT 🌟 ⭐ //
const StoragePileCtx = createContext()
export const StoragePileCtxProvider = props => {
  const { gamePlay } = useGamePlayCtx("StoragePileCtx")
  const { user } = useAuthCtx()
  const storagePile = useMemo(() => {
    const _storagePile =
      gamePlay &&
      gamePlay.gameStates &&
      gamePlay.gameStates[user.uid] &&
      gamePlay.gameStates[user.uid].storagePile

    return _storagePile
  }, [gamePlay, user.uid])

  return <StoragePileCtx.Provider value={{ storagePile }} {...props} />
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
  const memoSetPointsClimber = useCallback(args => {
    setPointsClimber(args)
  }, [])
  const memoSetPointsDisplay = useCallback(args => {
    setPointsDisplay(args)
  }, [])
  return (
    <PointsCtx.Provider
      value={{
        pointsDisplay,
        setPointsDisplay: memoSetPointsDisplay,
        pointsClimber,
        setPointsClimber: memoSetPointsClimber
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
  const incrementPointsClimber = useCallback(() => {
    setPointsClimber(old => old + 1)
  }, [setPointsClimber])
  const resetPointsClimber = useCallback(() => {
    setPointsClimber(1)
  }, [setPointsClimber])
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
  const [gameState, setGameStateR] = useState({})

  function setGameState(newState) {
    setGameStateR(newState)
  }
  const gameId = props.gameId

  useEffect(() => {
    const gameRef = firestore.doc(`/games/${gameId}`)
    const unsubscribe = gameRef.onSnapshot(doc => {
      const values = doc.data()
      setGameState({ ...values, gameId })
    })
    return unsubscribe
  }, [firestore, gameId])

  if (!gameId) return null
  return (
    <GameCtx.Provider
      value={{
        gameState,
        gameId
      }}
      {...props}
    />
  )
}

export const useGameCtx = byWho => {
  const ctx = useContext(GameCtx)
  if (!ctx)
    throw new Error("useGameCtx must be a descendant of GameCtxProvider 😕")
  const { gameState, gameId } = ctx

  return {
    gameState,
    gameId
  }
}
