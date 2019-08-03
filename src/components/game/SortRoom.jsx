import React from "react"
import { Dialog } from "@material-ui/core"
import { useGameCtx } from "../../hooks/useGameCtx"

const SortRoom = () => {
  const { state } = useGameCtx()
  return <Dialog open={state.dialog.open}>Hey i'm the sort room</Dialog>
}

export default SortRoom
