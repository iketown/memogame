import React, { useState, useCallback } from "react"
import styled from "styled-components"
import { images } from "../../images/newRooms/index"
import { Typography, Button } from "@material-ui/core"
//
import RoomDnD from "./RoomDnD/RoomDnD"
import SelectedRoom from "./SelectedRoomView/SelectedRoom.responsive.jsx"
import { useWindowSize } from "../../hooks/useScreenSize"
import { useHouseCtx, HouseCtxProvider } from "../../contexts/HouseContext"
//
//

export const StyledHouse = styled.div`
  display: inline-block;
  position: relative;
`

const HouseGrid = styled.div`
  /* to separate the roof from the rooms */
  display: grid;
  grid-template-rows: repeat(2, max-content);

  .rooms {
    background-color: #380000;
    display: grid;
    padding: 5px;
    grid-gap: 5px;
    grid-template-columns: max-content max-content;
    grid-template-rows: repeat(3, max-content);
    grid-template-areas: "bedroom bathroom" "kitchen dining" "garage office";
  }
`

export const Roof = styled.div`
  height: 22px;
  background-size: cover;
  transform: scale(1.1) translateY(10px);
  background-position: bottom;
  background-image: url(${p => (p.half ? images.roofHalf : images.roofFull)});
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
`
const HouseContainer = () => {
  return (
    <HouseCtxProvider>
      <House />
    </HouseCtxProvider>
  )
}

const House = () => {
  const { selectedRoom, setSelectedRoom } = useHouseCtx()
  const handleSelectRoom = useCallback(
    (roomId, faceUp = false) => {
      setSelectedRoom({ roomId, faceUp })
    },
    [setSelectedRoom]
  )

  return (
    <StyledHouse>
      <HouseGrid>
        <Roof />
        <div className="rooms">
          <RoomDnD
            hoverFX
            title="bedroom"
            handleSelectRoom={handleSelectRoom}
          />
          <RoomDnD
            hoverFX
            title="bathroom"
            handleSelectRoom={handleSelectRoom}
          />
          <RoomDnD
            hoverFX
            title="kitchen"
            handleSelectRoom={handleSelectRoom}
          />
          <RoomDnD hoverFX title="dining" handleSelectRoom={handleSelectRoom} />
          <RoomDnD hoverFX title="garage" handleSelectRoom={handleSelectRoom} />
          <RoomDnD hoverFX title="office" handleSelectRoom={handleSelectRoom} />
          {selectedRoom && selectedRoom.roomId && <SelectedRoom />}
        </div>
      </HouseGrid>
    </StyledHouse>
  )
}

export default HouseContainer
