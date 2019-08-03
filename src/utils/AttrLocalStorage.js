export const getAllAttrs = () => {
  const attrs = localStorage.getItem("attributes")
  return JSON.parse(attrs)
}

const getOldAttrs = () => {
  const attrsJson = localStorage.getItem("attributes")
  const oldAttrs = JSON.parse(attrsJson) || {}
  return oldAttrs
}
const saveNewAttrs = newAttrs => {
  const newAttrsJson = JSON.stringify(newAttrs)
  localStorage.setItem("attributes", newAttrsJson)
}

export const saveAttr = newAttr => {
  if (!newAttr.id) throw new Error("needs an id")
  // const optionsObj = newAttr.options.reduce((obj, opt) => {
  //   obj[opt.id] = opt
  //   return obj
  // }, {})
  // newAttr.options = optionsObj
  const oldAttrs = getOldAttrs()
  saveNewAttrs({ ...oldAttrs, [newAttr.id]: newAttr })
}

export const deleteAttr = attrId => {
  const oldAttrs = getOldAttrs()
  delete oldAttrs[attrId]
  saveNewAttrs(oldAttrs)
}
