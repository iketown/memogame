import React, { createContext, useContext, useState, useEffect } from "react"
//
import { getAllAttrs, saveAttr, deleteAttr } from "../utils/AttrLocalStorage"
const AttrContext = createContext()

export const AttrCtxProvider = props => {
  const [allAttrs, setAllAttrs] = useState({})

  function refreshAllAttrs() {
    const _allAttrs = getAllAttrs()
    console.log("allAttrs", _allAttrs)
    setAllAttrs(_allAttrs)
  }
  useEffect(() => {
    refreshAllAttrs()
  }, [])

  function handleSaveAttr(attr) {
    saveAttr(attr)
    refreshAllAttrs()
  }
  function handleDeleteAttr(attrId) {
    deleteAttr(attrId)
    refreshAllAttrs()
  }
  const value = {
    allAttrs,
    saveAttr: handleSaveAttr,
    deleteAttr: handleDeleteAttr
  }
  return <AttrContext.Provider value={value} {...props} />
}

export const useAttrCtx = () => {
  const ctx = useContext(AttrContext)
  if (!ctx)
    throw new Error("useAttrCtx must be a descendant of AttrCtxProvider 😕")
  const { allAttrs, saveAttr, deleteAttr } = ctx
  return { allAttrs, saveAttr, deleteAttr }
}
