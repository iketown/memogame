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
  const [state, dispatch] = useReducer(reducer, initialState)
  const faceUpToCenter = ({ cardId, sourceId = "faceUpPile" }) => {
    playCard({ cardId, gameId, sourceId }).then(res =>
      console.log("faceup response", res)
    )
  }
  const faceUpToHouse = ({ cardId, destId }) => {
    console.log("sending changeHouse", gameId, cardId, destId)
    const house = gamePlay.gameStates[user.uid].house
    const faceUpPile = gamePlay.gameStates[user.uid].faceUpPile

    const [room, index] = destId.split("-")
    house[room][index] = faceUpPile.shift()
    console.log(house, faceUpPile)
    setGamePlay(old => {
      const gamePlayObj = {
        ...old,
        gameStates: {
          ...old.gameStates,
          [user.uid]: { ...old.gameStates[user.uid], house, faceUpPile }
        }
      }
      console.log("gamePlayObj", gamePlayObj)
      return gamePlayObj
    })
    changeHouse({ gameId, cardId, destId, sourceId: "faceUpPile" })
  }
  const houseToHouse = ({ sourceId, destId, cardId }) => {
    console.log("house to house", sourceId, destId, cardId)
    changeHouse({ gameId, cardId, destId, sourceId })
  }
  const houseToCenter = ({ sourceId, cardId }) => {
    console.log("house to center")
    playCard({ cardId, gameId, sourceId })
  }
  return (
    <GamePlayCtx.Provider
      value={{
        faceUpToCenter,
        faceUpToHouse,
        houseToHouse,
        houseToCenter,
        state,
        dispatch
      }}
      {...otherProps}
    />
  )
}

export const useGamePlayCtx = () => {
  const ctx = useContext(GamePlayCtx)
  if (!ctx)
    throw new Error(
      "useGamePlayCtx must be a descendant of GamePlayCtxProvider 😕"
    )
  const {
    houseToCenter,
    faceUpToCenter,
    faceUpToHouse,
    houseToHouse,
    state,
    dispatch
  } = ctx
  return {
    houseToCenter,
    faceUpToCenter,
    faceUpToHouse,
    houseToHouse,
    state,
    dispatch
  }
}
