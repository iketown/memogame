import React, { createContext, useContext } from "react"
import items from "../json/items"
import { removeUid } from "../utils/imageUtils"
const ItemsCtx = createContext()

export const AllItemsCtxProvider = props => {
  return <ItemsCtx.Provider value={{ allItems: items }} {...props} />
}

export const useAllItemsCtx = () => {
  const ctx = useContext(ItemsCtx)
  const { allItems } = ctx
  const itemFromItemId = itemId => {
    const strippedId = removeUid(itemId)
    return allItems[strippedId]
  }
  return { allItems, itemFromItemId }
}
