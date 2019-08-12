import items from "../json/items"
import { useLocalStorage, getAllAttrs } from "./AttrLocalStorage"

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
  const allAttrs = getAllAttrs()
  const _itemsWithMatch = Object.entries(newItems).reduce(
    (obj, [itemId, item]) => {
      const color = allAttrs.color__id.options[item.color__id].text
      let colorCode = color.slice(0, 2) + color.charAt(color.length - 1)
      colorCode = colorCode.toUpperCase()
      const type = allAttrs.type__id.options[item.type__id].text
      const typeCode = type.slice(0, 3).toUpperCase()
      const matchId = `${colorCode}_${typeCode}_${item.firstLetter}`
      item.id = matchId
      obj[matchId] = item
      return obj
    },
    {}
  )
  console.log("allAttrs", allAttrs)
  console.log("items with match", _itemsWithMatch)
  const newItemsJson = JSON.stringify(newItems)
  const itemsWithMatchCodesJson = JSON.stringify(_itemsWithMatch)
  localStorage.setItem("items", newItemsJson)
  localStorage.setItem("match_items", itemsWithMatchCodesJson)
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
