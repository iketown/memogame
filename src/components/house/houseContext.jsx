import React, { createContext, useContext, useReducer } from "react"

const HouseCtx = createContext()

const initialState = {
  faceUpPile: [],
  dialog: { open: false, roomId: "garage" },
  bedroom: [false, false, false],
  bathroom: [false, false, false],
  garage: [false, false, false],
  kitchen: [false, false, false]
}
const reducer = (state, action) => {
  const { type } = action
  switch (type) {
    case "CLOSE_DIALOG": {
      return { ...state, dialog: { ...state.dialog, open: false } }
    }
    case "START_GAME": {
      const { items } = action
      const faceUpPile = Object.values(items).map(item => item.id)
      return { ...state, faceUpPile }
    }
    case "REORDER-ROOM": {
      const { roomId } = state.dialog
      const { source, destination } = action.result
      const room = [...state[roomId]]
      const [movingId] = room.splice(source.index, 1)
      room.splice(destination.index, 0, movingId)
      return { ...state, [roomId]: room }
    }
    case "MOVE-DOT": {
      const { draggableId, source, destination } = action.result
      if (!destination) return state
      if (
        source.droppableId === destination.droppableId ||
        destination.droppableId === "faceUpPile"
      )
        return state
      if (
        source.droppableId === "faceUpPile" &&
        destination.droppableId !== "centerPile"
      ) {
        const faceUpPile = [...state.faceUpPile]
        const movingId = faceUpPile.shift()
        const [destRoomId, destIndex] = destination.droppableId.split("-")
        const destRoom = [...state[destRoomId]]
        destRoom[destIndex] = movingId
        return {
          ...state,
          faceUpPile,
          [destRoomId]: destRoom,
          dialog: { open: true, roomId: destRoomId }
        }
        // handle ending the turn here.
      }
      const [sourceRoomId, sourceIndex] = source.droppableId.split("-")
      const [destRoomId, destIndex] = destination.droppableId.split("-")
      const sourceRoom = [...state[sourceRoomId]]
      if (sourceRoomId === destRoomId) {
        sourceRoom[sourceIndex] = false
        sourceRoom[destIndex] = draggableId
        return { ...state, [sourceRoomId]: sourceRoom }
      }
      const destRoom = [...state[destRoomId]]
      const movingId = sourceRoom[sourceIndex]
      sourceRoom[sourceIndex] = false
      destRoom[destIndex] = movingId
      return { ...state, [sourceRoomId]: sourceRoom, [destRoomId]: destRoom }
    }
    default:
      return state
  }
}

export const HouseCtxProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <HouseCtx.Provider value={{ state, dispatch }} {...props} />
}

export const useHouseCtx = () => {
  const ctx = useContext(HouseCtx)
  if (!ctx)
    throw new Error("house ctx needs to be a descendant of house provider")
  const { state, dispatch } = ctx
  return { state, dispatch }
}
