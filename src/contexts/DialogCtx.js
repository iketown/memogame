import React, { useReducer, useContext } from "react"

const DialogCtx = React.createContext()

const initialState = {
  formOpen: false,
  formType: "editProfile",
  maxWidth: "sm"
}

const reducer = (state, action) => {
  const { type, formType, formOpen = true, ...otherProps } = action
  switch (type) {
    case "OPEN_FORM": {
      return { ...state, formType, formOpen, ...otherProps }
    }
    case "OPEN_NEW_FORM": {
      return { formType, formOpen }
    }
    case "OPEN_ALERT": {
      return { ...state, formType: "alert", formOpen: true, ...otherProps }
    }
    case "CLOSE_FORM": {
      return { ...state, formOpen: false }
    }
    case "RESET": {
      return initialState
    }
    default:
      return state
  }
}

export const DialogCtxProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <DialogCtx.Provider value={{ state, dispatch }} {...props} />
}

export const useDialogCtx = () => {
  const context = useContext(DialogCtx)
  if (!context)
    throw new Error("useDialogCtx must be a descendant of DialogCtxProvider 😕")
  const { state, dispatch } = context
  function handleCloseForm() {
    dispatch({ type: "CLOSE_FORM" })
  }
  return { state, dispatch, handleCloseForm }
}
