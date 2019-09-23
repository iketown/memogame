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
  const [whosOnline, setWhosOnline] = useState({})

  const { user } = useAuthCtx()
  const { fdb, cancelMyInviteFromThisGame, updateLastSeen } = useFirebase()
  const gamePlayListenerRef = useRef()
  const refStopper = useRef()
  const myGameState = useMemo(() => {
    const _myGameState =
      gamePlay && gamePlay.gameStates && gamePlay.gameStates[user.uid]
    if (_myGameState && _myGameState.inviteStillExists) {
      cancelMyInviteFromThisGame({ gameId })
    }
    if (_myGameState && !_myGameState.lastSeen) {
      updateLastSeen({ gameId })
    }
    return _myGameState
  }, [gameId, gamePlay, cancelMyInviteFromThisGame, updateLastSeen, user.uid])

  useEffect(() => {
    if (!!gamePlay && gamePlay.gameStates) {
      const _whosOnline = Object.entries(gamePlay.gameStates).reduce(
        (obj, [id, state]) => {
          const online = !!state.lastSeen && moment().diff(state.lastSeen)
          // either truthy or false
          obj[id] = online
          return obj
        },
        {}
      )
      _whosOnline.all =
        Object.values(_whosOnline).filter(online => !online).length <= 0
      setWhosOnline(_whosOnline)
    }
  }, [gamePlay])

  const myTotalCards = useMemo(() => {
    let allCards = []
    if (myGameState) {
      const { house, storagePile } = myGameState
      if (house) {
        Object.values(house).forEach(room => {
          allCards.push(...room)
        })
      }
      if (storagePile) {
        allCards.push(...storagePile)
      }
    }
    return allCards.length
  }, [myGameState])

  useEffect(() => {
    const setGamePlay = newState => {
      setGamePlayINSTATE(newState)
    }
    const gamePlayRef = fdb.ref(`/currentGames/${gameId}`)
    if (!gamePlayListenerRef.current) {
      gamePlayListenerRef.current = gamePlayRef.on("value", snapshot => {
        const newValue = snapshot.val()
        setGamePlay(newValue)
      })
    } else {
      refStopper.current = refStopper.current ? refStopper.current + 1 : 1
    }
  }, [fdb, gameId, gamePlay])

  return (
    <GamePlayCtx.Provider
      value={{ gamePlay, whosOnline, myGameState, myTotalCards }}
      {...props}
    />
  )
}

export const useGamePlayCtx = calledBy => {
  const ctx = useContext(GamePlayCtx)
  if (!ctx)
    throw new Error(
      "useGamePlay must be a descendant of GamePlayCtxProvider 😕"
    )

  const { gamePlay, myGameState, myTotalCards, whosOnline } = ctx
  return { gamePlay, myGameState, myTotalCards, whosOnline }
}
