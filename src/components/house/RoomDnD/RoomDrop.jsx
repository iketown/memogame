import React from "react"
import { useDrop } from "react-dnd"
import styled from "styled-components"
import { ItemTypes } from "../../../dnd/itemTypes"
import { useHouseCtx } from "../../../contexts/GameCtx"
import { maxItemsPerRoom } from "../../../utils/gameLogic"
const StyledRoomContainer = styled.div`
  border: ${p => (p.canDrop ? "5px solid yellow" : "none")};
  position: absolute;
  /* background: ${p => (p.isOver ? "white" : "none")}; */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
    align-items: flex-end;
    justify-content: center;
`
//
//
const RoomDrop = ({ children, roomId }) => {
  const { myHouse } = useHouseCtx()
  const thisRoom = myHouse[roomId] || []
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item, mon) => {
      console.log("item dropped", item)
      return { droppedAt: roomId, index: thisRoom.length }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    }),
    canDrop: () => thisRoom.length < maxItemsPerRoom
  })
  return (
    <StyledRoomContainer canDrop={isOver && canDrop} ref={dropRef}>
      {children}
    </StyledRoomContainer>
  )
}

export default RoomDrop
