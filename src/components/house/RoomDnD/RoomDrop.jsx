import React, { useMemo } from "react"
import { useDrop } from "react-dnd"
import styled from "styled-components"
import { ItemTypes } from "../../../dnd/itemTypes"
import { maxItemsPerRoom } from "../../../utils/gameLogic"
import { useHouseCtx } from "../../../contexts/HouseContext"
import moment from "moment"

//
//
const StyledRoomContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  :after {
    opacity: ${p => (p.isOver || p.canDrop ? 1 : 0)};
    border: ${p =>
      p.isOver && p.canDrop
        ? "5px solid green"
        : p.canDrop
        ? "5px solid yellow"
        : "none"};
    transition: opacity 0.5s;

    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`
//
//
const RoomDrop = ({ children, roomId, thisRoom = [], handleSelectRoom }) => {
  const { selectedRoom, setSelectedRoom } = useHouseCtx()
  const canDropBool = useMemo(() => {
    return thisRoom.length < maxItemsPerRoom
  }, [thisRoom.length])
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item, mon) => {
      setSelectedRoom({ roomId, faceUp: true })
      return { droppedAt: roomId, index: thisRoom.length }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    }),
    canDrop: () => canDropBool
  })
  console.log("rendering DnD roomdrop", roomId)
  return (
    <StyledRoomContainer isOver={isOver} canDrop={canDrop} ref={dropRef}>
      {children}
    </StyledRoomContainer>
  )
}

export default RoomDrop
