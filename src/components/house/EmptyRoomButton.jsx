import React, { useState } from "react"
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle
} from "@material-ui/core"
import { useGameFxns } from "../../hooks/useGameFxns"
const EmptyRoomButton = ({ roomId, handleCloseRoom }) => {
  const [open, setOpen] = useState(false)
  const { emptyRoomToStorageFX } = useGameFxns()
  function handleConfirm() {
    emptyRoomToStorageFX({ roomId }).then(() => {
      setOpen(false)
      handleCloseRoom()
    })
  }
  function handleCancel() {
    setOpen(false)
  }
  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        <span role="img" aria-label="confused face">
          😕
        </span>{" "}
        Empty Room
      </Button>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Are You Sure?</DialogTitle>
        <DialogContent>
          Click 'OK' to move all cards from <b>{roomId}</b> back to your storage
          pile.
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default EmptyRoomButton
