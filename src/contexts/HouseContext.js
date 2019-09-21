import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useMemo,
  useCallback
} from "react"
import { useGamePlayCtx } from "./GamePlayCtx"
import moment from "moment"

// ⭐ 🌟 HOUSE CONTEXT 🌟 ⭐ //
const HouseCtx = createContext()
export const HouseCtxProvider = props => {
  const [selectedRoom, setSelectedRoom] = useState({
    roomId: "",
    faceUp: false
  })
  const expiryTime = () => {
    const faceUpSeconds = 10
    return moment()
      .add(faceUpSeconds, "seconds")
      .toISOString()
  }
  const setSelectedRoomAndLog = useCallback(args => {
    if (args.faceUp) {
      setSelectedRoom(old => ({ ...args, expiryTime: expiryTime() }))
    } else {
      setSelectedRoom(args)
    }
  }, [])
  const resetRoomTimer = useCallback(() => {
    setSelectedRoom(old => ({ ...old, expiryTime: expiryTime() }))
  }, [])
  const onTimerEnd = useCallback(() => {
    setSelectedRoom(old => ({ ...old, expiryTime: null, faceUp: false }))
  }, [])

  const { myGameState } = useGamePlayCtx("HouseCtx")
  // const [myHouse, setMyHouse] = useState({})
  const _myHouse = (myGameState && myGameState.house) || {}
  const myHouse = useMemo(() => {
    return _myHouse
  }, [_myHouse])

  return (
    <HouseCtx.Provider
      value={{
        myHouse,
        selectedRoom,
        setSelectedRoom: setSelectedRoomAndLog,
        resetRoomTimer,
        onTimerEnd
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
    selectedRoom,
    setSelectedRoom,
    resetRoomTimer,
    onTimerEnd
  } = ctx

  const cardsInMyHouse = useMemo(() => {
    if (!!myHouse) {
      const quantity = Object.values(myHouse).reduce((sum, room) => {
        sum += room.length
        return sum
      }, 0)
      return quantity
    }
  }, [myHouse])

  return {
    myHouse,
    cardsInMyHouse,
    selectedRoom,
    setSelectedRoom,
    resetRoomTimer,
    onTimerEnd
  }
}
// ⭐ 🌟 end HOUSE CONTEXT 🌟 ⭐ //
