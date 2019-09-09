import React from "react"
import styled from "styled-components"
import { Button } from "@material-ui/core"
import { images } from "../../../images/newRooms"
//
const SelectedRoomSection = styled.div`
  position: relative;
  grid-area: 1/1/-1/-1;
  z-index: 4;
`
const SelectedRoomContent = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
`
const SelectedRoomBackground = styled.div`
  background-image: url(${p => images[p.selectedRoom]});
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  /* z-index: 3; */
  :after {
    position: absolute;
    content: "";
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffffb8;
    z-index: 3;
  }
`
//
//
const SelectedRoom = ({ selectedRoom, handleSelectRoom }) => {
  return (
    <SelectedRoomSection selectedRoom={selectedRoom}>
      <SelectedRoomBackground selectedRoom={selectedRoom} />
      <SelectedRoomContent>
        <div>in here now</div>
        <Button onClick={() => handleSelectRoom(null)}>cancel</Button>
      </SelectedRoomContent>
    </SelectedRoomSection>
  )
}

export default SelectedRoom
