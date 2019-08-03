export const getAllItems = () => {
  return getOldItems()
}

const getOldItems = () => {
  const items = localStorage.getItem("items")
  return JSON.parse(items) || {}
}

const saveNewItems = newItems => {
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
