import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer
} from "react"
import { useItemCtx } from "../contexts/ItemContext"
import { useGameLogic, shuffle } from "../utils/gameLogic"
const GameCtx = createContext()

export const maxItems = 3

const initialState = {
  // these 'items' lists are itemIds.  not the items themselves
  faceUpPile: { maxItems: 10000, items: [] },
  centerPile: { maxItems: 10000, items: [] },
  room1: { maxItems, items: [], awaitingConfirmation: false },
  room2: { maxItems, items: [], awaitingConfirmation: false },
  room3: { maxItems, items: [], awaitingConfirmation: false },
  room4: { maxItems, items: [], awaitingConfirmation: false },
  room5: { maxItems, items: [], awaitingConfirmation: false },
  room6: { maxItems, items: [], awaitingConfirmation: false },
  snack: {
    open: false,
    content: ""
  }
}
const reducer = (state, action) => {
  const { type } = action
  console.log(action)
  switch (type) {
    case "START_GAME": {
      const { allItems } = action
      const faceUpItems = Object.values(allItems)
      shuffle(faceUpItems)
      const topItemId = faceUpItems.pop()
      return {
        ...initialState,
        faceUpPile: { ...state.faceUpPile, items: faceUpItems },
        centerPile: { ...state.centerPile, items: [topItemId] }
      }
    }
    case "OPEN_SNACK": {
      return {
        ...state,
        snack: {
          open: true,
          content: action.content,
          background: action.background
        }
      }
    }
    case "CLOSE_SNACK": {
      return { ...state, snack: { open: false, content: "" } }
    }
    case "SHUFFLE_CENTER": {
      const newCenterItems = [...state.centerPile.items]
      shuffle(newCenterItems)
      return {
        ...state,
        centerPile: { ...state.centerPile, items: newCenterItems }
      }
    }
    case "INVALID_CARD_PLAY": {
      // put all center pile cards into my faceup pile
      const newFaceUpPileItems = [
        ...state.faceUpPile.items,
        ...state.centerPile.items
      ]
      shuffle(newFaceUpPileItems)
      const newTopCard = newFaceUpPileItems.pop()
      return {
        ...state,
        centerPile: {
          ...state.centerPile,
          items: [newTopCard]
        },
        faceUpPile: {
          ...state.faceUpPile,
          items: newFaceUpPileItems
        }
      }
    }
    case "FACEUP_TO_CENTER": {
      const { movingId } = action
      const newFaceUpPile = {
        ...state.faceUpPile,
        items: [...state.faceUpPile.items.filter(id => id !== movingId)]
      }
      const newCenterPileItems = [...state.centerPile.items]
      newCenterPileItems.unshift(movingId)
      return {
        ...state,
        faceUpPile: newFaceUpPile,
        centerPile: { ...state.centerPile, items: newCenterPileItems }
      }
    }
    case "FACEUP_TO_ROOM": {
      const { movingId, destId, destIndex } = action
      const newFaceUpItems = [
        ...state.faceUpPile.items.filter(item => item !== movingId)
      ]
      const newRoomItems = [...state[destId].items]
      newRoomItems.splice(destIndex, 0, movingId)

      return {
        ...state,
        faceUpPile: { ...state.faceUpPile, items: newFaceUpItems },
        [destId]: {
          ...state[destId],
          items: newRoomItems,
          awaitingConfirmation: true
        }
      }
    }
    case "CONFIRM_ROOM": {
      const { roomId } = action
      return {
        ...state,
        [roomId]: { ...state[roomId], awaitingConfirmation: false }
      }
    }
    case "ROOM_TO_CENTER": {
      const { sourceId, movingId } = action
      const newSourceItems = [
        ...state[sourceId].items.filter(item => item !== movingId)
      ]
      const newCenterItems = [...state.centerPile.items]
      newCenterItems.unshift(movingId)
      return {
        ...state,
        centerPile: {
          ...state.centerPile,
          items: newCenterItems
        },
        [sourceId]: { ...state[sourceId], items: newSourceItems }
      }
    }
    case "ROOM_TO_ROOM": {
      const { sourceId, sourceIndex, destId, destIndex, movingId } = action

      if (sourceId === destId) {
        // swap places
        const newItems = [...state[sourceId].items]
        const [moving] = newItems.splice(sourceIndex, 1)
        console.log("moving, movingId", moving, movingId)
        newItems.splice(destIndex, 0, moving)
        return { ...state, [sourceId]: { ...state[sourceId], items: newItems } }
      } else {
        return state
      }
    }
    // case "MOVE_CARD": {
    //   const { source, destination, draggableId } = action.result
    //   console.log({ source, destination, draggableId })
    //   const sourceId = source.droppableId // faceUpPile ?
    //   const destId = destination.droppableId // room1 ?
    //   if (state[destId].items.length >= state[destId].maxItems) {
    //     // swap moving card with house card
    //     return state
    //   }
    //   const movingItem = draggableId
    //   const newSourceItems = [
    //     ...state[sourceId].items.filter(_item => _item !== movingItem)
    //   ]
    //   if (destId === "centerPile") {
    //     const newCenterPileItems = [...state.centerPile.items]
    //     newCenterPileItems.unshift(movingItem)
    //     return {
    //       ...state,
    //       [sourceId]: { ...state[sourceId], items: newSourceItems },
    //       centerPile: { ...state.centerPile, items: newCenterPileItems }
    //     }
    //   }
    //   const newDestItems = [...state[destId].items]
    //   newDestItems.splice(destination.index, 0, movingItem)
    //   // only confirm and 'show' a room if this is your final move (from faceup pile)
    //   const awaitingConfirmation = sourceId === "faceUpPile"
    //   const newDestRoom = {
    //     ...state[destId],
    //     items: newDestItems,
    //     awaitingConfirmation
    //   }
    //   const newSourceRoom = {
    //     ...state[sourceId],
    //     items: newSourceItems
    //   }
    //   return { ...state, [sourceId]: newSourceRoom, [destId]: newDestRoom }
    // }
    // case "MOVE_BETWEEN_ROOMS": {
    //   const { source, destination, draggableId } = action.result
    //   const sourceId = source.droppableId // NOT faceUpPile
    //   const destId = destination.droppableId // room1 ?
    //   const newSourceItems = [
    //     ...state[sourceId].items.filter(item => item !== draggableId)
    //   ]
    //   const newDestItems = [...state[destId].items]
    //   newDestItems.splice(destination.index, 0, draggableId)
    //   return {
    //     ...state,
    //     [sourceId]: { ...state.sourceId, items: newSourceItems },
    //     [destId]: { ...state.destId, items: newDestItems }
    //   }
    // }
    // case "REDO_ROOM": {
    //   const { source, destination, draggableId } = action.result
    //   const sourceId = source.droppableId
    //   const newItems = [...state[sourceId].items]
    //   const [movingItem] = newItems.splice(source.index, 1)
    //   newItems.splice(destination.index, 0, movingItem)
    //   return { ...state, [sourceId]: { ...state[sourceId], items: newItems } }
    // }
    // case "CONFIRM_ROOM": {
    //   const { roomId } = action
    //   return {
    //     ...state,
    //     [roomId]: { ...state[roomId], awaitingConfirmation: false }
    //   }
    // }
    // case "TAKE_PILE": {
    //   const pileItems = state.centerPile.items

    //   return state
    // }
    default:
      return state
  }
}

export const GameCtxProvider = props => {
  const { allItems } = useItemCtx()
  const { doTheyMatch } = useGameLogic()
  // const [itemStack, setItemStack] = useState([])
  const [unplayedItems, setUnplayedItems] = useState()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [gameStatus, setGameStatus] = useState("start")
  function endTurn() {
    dispatch({
      type: "OPEN_SNACK",
      content: "end turn",
      background: "black"
    })
    dispatch({ type: "SHUFFLE_CENTER" })
  }
  function onDragEnd(result) {
    const { source, destination, draggableId: movingId } = result
    if (!destination) return null
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      console.log("didn't move")
      return null
    }
    const { droppableId: sourceId, index: sourceIndex } = source
    const { droppableId: destId, index: destIndex } = destination
    const actionInfo = { sourceId, sourceIndex, destId, destIndex, movingId }
    //  two places you can drag FROM:  faceupPile or Room
    // #1:  faceUpPile
    if (sourceId === "faceUpPile") {
      // this is last move for this turn
      if (destId === "centerPile") {
        const centerCardId = state.centerPile.items[0]
        const isValid = doTheyMatch(centerCardId, movingId)
        if (isValid) {
          dispatch({ type: "FACEUP_TO_CENTER", ...actionInfo })
          endTurn()
        } else {
          dispatch({
            type: "OPEN_SNACK",
            content: "Not Valid!",
            background: "red"
          })
          dispatch({ type: "INVALID_CARD_PLAY" })
          setTimeout(endTurn, 1500)
        }
      } else {
        dispatch({ type: "FACEUP_TO_ROOM", ...actionInfo })
      }
    } else {
      // #2 ROOM
      if (destination.droppableId === "centerPile") {
        dispatch({ type: "ROOM_TO_CENTER", ...actionInfo })
      } else {
        dispatch({ type: "ROOM_TO_ROOM", ...actionInfo })
      }
    }
    // two places you can drag TO:
    // room or centerPile

    // if from room:
    //  // if to another room
    //  // if to the same room
    //  //  if to the center pile

    // if from faceUpPile
    //  // if to room
    //  // if to centerpile
    if (source.droppableId === destination.droppableId) {
      dispatch({ type: "REDO_ROOM", result })
      return null
    }
    if (
      source.droppableId !== "faceUpPile" &&
      destination.droppableId !== "centerPile"
    ) {
      dispatch({ type: "MOVE_BETWEEN_ROOMS", result })
    }
    if (destination.droppableId === "centerPile") {
      // check if you can drag this card onto the current centerPile card
      const centerCardId = state.centerPile.items[0]
      const draggingCardId = result.draggableId
      const isValid = doTheyMatch(centerCardId, draggingCardId)
      if (isValid) {
        dispatch({ type: "MOVE_CARD", result })
        return
      } else {
        dispatch({ type: "TAKE_PILE", result })
        return null
      }
    } else {
      // moving from faceUp into House
      console.log("moving to house")
      dispatch({ type: "MOVE_CARD", result })
    }
  }

  function confirmRoom(roomId) {
    dispatch({ type: "CONFIRM_ROOM", roomId })
    endTurn()
  }

  //
  return (
    <GameCtx.Provider
      value={{
        // addItemToStack,
        // lastItem,
        unplayedItems,
        // itemStack,
        onDragEnd,
        gameStatus,
        state,
        dispatch,
        confirmRoom
      }}
      {...props}
    />
  )
}

export const useGameCtx = () => {
  const ctx = useContext(GameCtx)
  if (!ctx)
    throw new Error(
      "useGameCtx must be a descendant of GameCtxProvider, you dickhead. 😕 "
    )
  const {
    // addItemToStack,
    // lastItem,
    unplayedItems,
    // itemStack,
    onDragEnd,
    gameStatus,
    state,
    dispatch,
    confirmRoom
  } = ctx
  return {
    // addItemToStack,
    // lastItem,
    unplayedItems,
    // itemStack,
    onDragEnd,
    gameStatus,
    state,
    dispatch,
    confirmRoom
  }
}
