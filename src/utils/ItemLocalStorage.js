import items from "../json/items"
import { useLocalStorage } from "./AttrLocalStorage"

export const getAllItems = () => {
  return getOldItems()
}

const getOldItems = () => {
  if (useLocalStorage) {
    const localItems = localStorage.getItem("items")
    return JSON.parse(localItems) || {}
  }
  return items
}

const saveNewItems = newItems => {
  if (!useLocalStorage) throw new Error("switch useLocalStorage to true")
  const newItemsJson = JSON.stringify(newItems)
  localStorage.setItem("items", newItemsJson)
}

export const saveItem = newItem => {
  if (!newItem.id) throw new Error("needs an id!")
  const oldItems = getOldItems()
  saveNewItems({ ...oldItems, [newItem.id]: newItem })
}

export const deleteItem = itemId => {
  const oldItems = getOldItems()
  delete oldItems[itemId]
  saveNewItems(oldItems)
}
