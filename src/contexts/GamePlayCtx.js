import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo
} from "react"
import { useFirebase } from "./FirebaseCtx"
import moment from "moment"
import { useAuthCtx } from "./AuthCtx"

const GamePlayCtx = createContext()

export const GamePlayCtxProvider = ({ gameId, ...props }) => {
  const [gamePlay, setGamePlayINSTATE] = useState({})
  const { user } = useAuthCtx()
  const { fdb } = useFirebase()
  const gamePlayListenerRef = useRef()
  const refStopper = useRef()
  const myGameState = useMemo(() => {
    return gamePlay && gamePlay.gameStates && gamePlay.gameStates[user.uid]
  }, [gamePlay, user.uid])
  useEffect(() => {
    const setGamePlay = newState => {
      console.log("setting game play")
      setGamePlayINSTATE(newState)
    }
    const gamePlayRef = fdb.ref(`/currentGames/${gameId}`)
    if (!gamePlayListenerRef.current) {
      gamePlayListenerRef.current = gamePlayRef.on("value", snapshot => {
        console.log("gamePlay update", snapshot.val(), moment().toISOString())
        const newValue = snapshot.val()
        setGamePlay(newValue)
      })
    } else {
      refStopper.current = refStopper.current ? refStopper.current + 1 : 1
      console.log("ref stopped another listener", refStopper.current)
    }
  }, [fdb, gameId, gamePlay])

  return <GamePlayCtx.Provider value={{ gamePlay, myGameState }} {...props} />
}

export const useGamePlayCtx = calledBy => {
  const ctx = useContext(GamePlayCtx)
  if (!ctx)
    throw new Error(
      "useGamePlay must be a descendant of GamePlayCtxProvider 😕"
    )

  console.log("useGamePlayCtx called by", calledBy)
  const { gamePlay, myGameState } = ctx
  return { gamePlay, myGameState }
}
