import React, { createContext, useContext, useReducer } from "react"

const ItemFilterCtx = createContext()

const initialState = {
  hiddenAttrs: [],
  soloAttr: false
}
const reducer = (state, action) => {
  const { type, attrId, optId } = action
  switch (type) {
    case "TOGGLE_SOLO_ATTR": {
      if (state.soloAttr.optId === optId) return { ...state, soloAttr: false }
      return { ...state, soloAttr: { attrId, optId } }
    }
    case "TOGGLE_HIDE_ATTR": {
      let newHiddenAttrs
      if (state.hiddenAttrs.includes(attrId)) {
        // remove from hidden.
        newHiddenAttrs = state.hiddenAttrs.filter(_attrId => _attrId !== attrId)
      } else {
        // add to hidden
        newHiddenAttrs = [...state.hiddenAttrs, attrId]
      }
      return { ...state, hiddenAttrs: [...newHiddenAttrs] }
    }
    default:
      return state
  }
}

export const ItemFilterCtxProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <ItemFilterCtx.Provider value={{ state, dispatch }} {...props} />
}

export const useItemFilterCtx = () => {
  const ctx = useContext(ItemFilterCtx)
  if (!ctx)
    throw new Error(
      "useItemFilterCtx must be a descendant of ItemFilterCtxProvider 😕"
    )
  const { state, dispatch } = ctx
  function toggleHideAttr(attrId) {
    dispatch({ type: "TOGGLE_HIDE_ATTR", attrId })
  }
  function toggleSoloAttr({ attrId, optId }) {
    dispatch({ type: "TOGGLE_SOLO_ATTR", attrId, optId })
  }
  return { state, dispatch, toggleSoloAttr }
}
