import React, { useState } from "react"
import styled from "styled-components"
import { images } from "../../images/newRooms/index"
import { Typography, Button } from "@material-ui/core"
//
import RoomDnD from "./RoomDnD/RoomDnD"
import SelectedRoom from "./SelectedRoomView/SelectedRoom.responsive.jsx"
import { useWindowSize } from "../../hooks/useScreenSize"
//
//

export const HouseContainer = styled.div`
  display: inline-block;
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
  height: ${p => (p.short ? "22" : "23")}px;
  background-size: cover;
  transform: scale(1.1) translateY(10px);
  background-position: bottom;
  background-image: url(${p => (p.half ? images.roofHalf : images.roofFull)});
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
`

const House = () => {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const { heightText } = useWindowSize()
  const handleSelectRoom = title => {
    console.log("selecting room", title)
    setSelectedRoom(title)
  }
  return (
    <HouseContainer>
      <HouseGrid>
        <Roof short={heightText === "short"} />
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
          {selectedRoom && (
            <SelectedRoom
              selectedRoom={selectedRoom}
              handleSelectRoom={handleSelectRoom}
            />
          )}
        </div>
      </HouseGrid>
    </HouseContainer>
  )
}

export default House
