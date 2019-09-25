import React from "react"
import styled from "styled-components"
import { useDrop } from "react-dnd"
import { ItemTypes } from "../../../dnd/itemTypes"
import { FaArrowDown } from "react-icons/fa"
import { maxItemsPerRoom } from "../../../utils/gameLogic"
import { useHouseCtx } from "../../../contexts/HouseContext"
const ExpandingBox = styled.div`
  /* height: 3rem; */
  /* background: ${p => (p.expand ? "blue" : "gainsboro")}; */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  .arrow {
    font-size: 3rem;
    display: ${p => (p.expand ? "block" : "none")};
  }
`
const SpacerBox = styled.div`
  width: 100%;
  padding: 1rem;
`
const ReorderPlaceholder = ({ thisRoom = [], roomId, children, index }) => {
  const { setSelectedRoom } = useHouseCtx()
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: ({ itemId }, monitor) =>
      !thisRoom.includes(itemId) && thisRoom.length < maxItemsPerRoom,
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop()
    }),
    drop: item => {
      setSelectedRoom({ roomId, faceUp: true })
      return { droppedAt: roomId, index }
    }
  })
  return (
    <ExpandingBox ref={dropRef} expand={isOver && canDrop}>
      <FaArrowDown className="arrow" />
      {children ? children : <SpacerBox />}
    </ExpandingBox>
  )
}

export default ReorderPlaceholder
