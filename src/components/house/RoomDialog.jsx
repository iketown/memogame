import React from "react"
import {
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Button,
  Typography
} from "@material-ui/core"
import styled from "styled-components"
import { Droppable } from "react-beautiful-dnd"
//
import { useHouseCtx } from "./houseContext"
import roomImages from "../../images"
import { DragDot } from "./House"
import DialogDot from "./DialogDot"
const widthVW = 70
//
//
const RoomContainer = styled.div`
  position: relative;
  height: 32rem;
  width: 17rem;
  /* height: ${p => widthVW / roomImages[p.roomId].ratio}vw;
  width: ${widthVW}vw; */
`
const RoomBackground = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  background-image: url(${p => roomImages[p.roomId].image});
  background-size: cover;
  filter: blur(2px);
  opacity: 0.5;
`
const RoomContent = styled(DialogContent)`
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
`
const CirclesDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 30rem;
  .dot {
    margin: 2rem 0;
  }
`

const RoomDialog = () => {
  const { state, dispatch } = useHouseCtx()
  const {
    dialog: { open, roomId }
  } = state
  function handleClose() {
    dispatch({ type: "CLOSE_DIALOG" })
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <RoomContainer roomId={roomId}>
        <RoomBackground roomId={roomId} />
        <RoomContent>
          {open && (
            <Droppable droppableId={`dialog`}>
              {({ droppableProps, innerRef, placeholder }) => (
                <CirclesDiv {...droppableProps} ref={innerRef}>
                  {state[roomId].map((dragId, index) => (
                    <DialogDot
                      key={(dragId, index)}
                      dragId={dragId}
                      index={index}
                    />
                  ))}
                  {placeholder}
                </CirclesDiv>
              )}
            </Droppable>
          )}
        </RoomContent>
      </RoomContainer>

      <DialogActions style={{ justifyContent: "space-between" }}>
        <Typography variant="button">{state.dialog.roomId}</Typography>
        <Button variant="contained" color="primary" onClick={handleClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RoomDialog
