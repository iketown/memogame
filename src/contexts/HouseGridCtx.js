import React, { createContext, useContext, useReducer, useState } from "react"
//
import { shuffle } from "../utils/gameLogic"
import { useAllItemsCtx } from "./AllItemsCtx"
const HouseGridCtx = createContext()

const initialState = {
  storagePile: [],
  house: {
    attic: [],
    bedroom: [],
    bathroom: [],
    family: [],
    kitchen: [],
    cellar: []
  }
}
const reducer = (state, action) => {
  console.log("action", action)
  switch (action.type) {
    case "FILL_HOUSE": {
      const { fillObject, fakeStoragePile } = action
      const newState = { ...state }
      Object.entries(fillObject).forEach(
        ([room, itemIdArr]) => (newState.house[room] = itemIdArr)
      )
      newState.storagePile = fakeStoragePile
      return newState
    }
    case "ADD_TO_ROOM": {
      const { itemId, roomId } = action
      return {
        ...state,
        storagePile: state.storagePile.filter(id => id !== itemId),
        house: { ...state.house, [roomId]: [...state.house[roomId], itemId] }
      }
    }
    case "REORDER_ROOM": {
      const { room, sourceIndex, destIndex, itemId } = action
      const house = { ...state.house }
      const [movingId] = house[room].splice(sourceIndex, 1)
      house[room].splice(destIndex, 0, movingId)
      if (movingId !== itemId) {
        console.log("wrong itemId")
        return state
      }
      return { ...state, house }
    }
    default:
      return state
  }
}

export const HouseGridCtxProvider = props => {
  const [expandedRoom, setExpandedRoom] = useState({
    roomId: false,
    faceUp: false
  })
  const [houseState, houseDispatch] = useReducer(reducer, initialState)
  const { allItems } = useAllItemsCtx()
  const fillHouse = () => {
    const itemsArr = Object.entries(allItems)
    shuffle(itemsArr)
    const fillObject = [
      "attic",
      "bedroom",
      "bathroom",
      "family",
      "kitchen",
      "cellar"
    ].reduce((obj, roomName) => {
      const length = Math.floor(Math.random() * 4)
      obj[roomName] = [
        ...Array.from({ length }, x => `${itemsArr.pop()[0]}_${Math.random()}`)
      ] //  grab the itemId and add id stuff on the end
      return obj
    }, {})
    houseDispatch({
      type: "FILL_HOUSE",
      fillObject,
      fakeStoragePile: itemsArr.map(i => i[0])
    })
  }
  return (
    <HouseGridCtx.Provider
      value={{
        houseState,
        houseDispatch,
        fillHouse,
        expandedRoom,
        setExpandedRoom
      }}
      {...props}
    />
  )
}

export const useHouseGridCtx = () => {
  const ctx = useContext(HouseGridCtx)
  if (!ctx)
    throw new Error(
      "usehouseGridCtx must be a descendant of HouseGridCtxProvider 😕"
    )
  const {
    houseState,
    houseDispatch,
    fillHouse,
    expandedRoom,
    setExpandedRoom
  } = ctx
  return { houseState, houseDispatch, fillHouse, expandedRoom, setExpandedRoom }
}
