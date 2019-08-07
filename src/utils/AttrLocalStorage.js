import attrs from "../json/attributes.js"

export const useLocalStorage = false

export const getAllAttrs = () => {
  if (useLocalStorage) {
    const localAttrs = localStorage.getItem("attributes")
    return JSON.parse(localAttrs)
  }
  return attrs
}

const saveNewAttrs = newAttrs => {
  if (!useLocalStorage) throw new Error("switch useLocalStorage to true")
  const newAttrsJson = JSON.stringify(newAttrs)
  localStorage.setItem("attributes", newAttrsJson)
}

export const saveAttr = newAttr => {
  if (!newAttr.id) throw new Error("needs an id")
  const oldAttrs = getAllAttrs()
  saveNewAttrs({ ...oldAttrs, [newAttr.id]: newAttr })
}

export const deleteAttr = attrId => {
  const oldAttrs = getAllAttrs()
  delete oldAttrs[attrId]
  saveNewAttrs(oldAttrs)
}
