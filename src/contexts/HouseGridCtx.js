import React, { createContext, useContext, useReducer } from "react"
//
import { useItemCtx } from "./ItemContext"
import { shuffle } from "../utils/gameLogic"
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
    default:
      return state
  }
}

export const HouseGridCtxProvider = props => {
  const [houseState, houseDispatch] = useReducer(reducer, initialState)
  const { allItems } = useItemCtx()
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
      value={{ houseState, houseDispatch, fillHouse }}
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
  const { houseState, houseDispatch, fillHouse } = ctx
  return { houseState, houseDispatch, fillHouse }
}
