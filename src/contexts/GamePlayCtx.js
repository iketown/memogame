import React, { createContext, useContext, useReducer } from "react"
import { useFirebase } from "./FirebaseCtx"
import { useGameCtx } from "./GameCtx"
import { useAuthCtx } from "./AuthCtx"

const GamePlayCtx = createContext()

const initialState = {
  playResponse: {
    open: true,
    itemId1: "",
    itemId2: ""
  },
  houseDialog: {
    open: false,
    roomId: ""
  }
}
const reducer = (state, action) => {
  switch (action.type) {
    case "OPEN_SNACK": {
      return { ...state, playResponse: { ...state.playResponse, open: true } }
    }
    case "CLOSE_SNACK": {
      return { ...state, playResponse: { ...state.playResponse, open: false } }
    }
    case "OPEN_RESPONSE": {
      const { itemId1, itemId2 } = action
      return { ...state, playResponse: { open: true, itemId1, itemId2 } }
    }
    case "FU_TO_HOUSE": {
      // only opens the dialog to give person a chance to reorganize that room.
      // the move from fu to house has already been sent to firebase
      const { roomId } = action
      return state
    }
    default:
      return state
  }
}

export const GamePlayCtxProvider = props => {
  const { gameId, ...otherProps } = props
  const { playCard, changeHouse } = useFirebase()
  const { user } = useAuthCtx()
  const { gamePlay, setGamePlay } = useGameCtx()
  const [gdState, gdDispatch] = useReducer(reducer, initialState)

  return (
    <GamePlayCtx.Provider
      value={{
        gdState,
        gdDispatch,
        gamePlay,
        setGamePlay
      }}
      {...otherProps}
    />
  )
}

export const useGamePlayCtx = () => {
  const gPCtx = useContext(GamePlayCtx)
  const { user } = useAuthCtx()
  if (!gPCtx)
    throw new Error(
      "useGamePlayCtx must be a descendant of GamePlayCtxProvider 😕"
    )
  const { gdState, gdDispatch, gamePlay, setGamePlay } = gPCtx
  // shared functions
  const arrayMinusItem = (arr, itemId) => {
    if (!arr || !arr.length || !itemId) throw new Error("missing something")
    return [...arr].filter(_itemId => _itemId !== itemId)
  }
  //
  const endTurnLocal = ({}) => {}
  const storageToCenterLocal = ({ itemId, gameId }) => {
    console.log("running storageToCenterLocal", itemId, gameId)
    setGamePlay(old => ({
      ...old,
      gameStates: {
        ...old.gameStates,
        [user.uid]: {
          ...old.gameStates[user.uid],
          storagePile: arrayMinusItem(
            old.gameStates[user.uid].storagePile,
            itemId
          )
        },
        centerCardPile: [itemId, ...old.centerCardPile]
      }
    }))
  }
  const storageToHouseLocal = ({ itemId, gameId, roomId }) => {}
  const houseToCenterLocal = ({ itemId, gameId, roomId }) => {}
  const houseToHouseLocal = ({}) => {}
  return {
    gdState,
    gdDispatch,
    endTurnLocal,
    storageToCenterLocal,
    storageToHouseLocal,
    houseToCenterLocal,
    houseToHouseLocal
  }
}
