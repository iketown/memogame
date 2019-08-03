import React, { useState } from "react"
import { Snackbar, SnackbarContent } from "@material-ui/core"
import { useGameCtx } from "../hooks/useGameCtx"

//
//
const SnackBarHandler = () => {
  const { state, dispatch } = useGameCtx()
  const { snack } = state
  return (
    <Snackbar
      autoHideDuration={2000}
      ContentProps={{ style: { background: snack.background } }}
      anchorOrigin={{ vertical: "center", horizontal: "center" }}
      open={snack.open}
      onClose={() => dispatch({ type: "CLOSE_SNACK" })}
      message={<span id="message-id">{snack.content}</span>}
    />
  )
}

export default SnackBarHandler
