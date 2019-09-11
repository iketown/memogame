import React from "react"
import styled from "styled-components"
import { useDrop } from "react-dnd"
import { ItemTypes } from "../../../dnd/itemTypes"
import { useHouseCtx } from "../../../contexts/GameCtx"
import { maxItemsPerRoom } from "../../../utils/gameLogic"

const SelectRoomContainer = styled.div`
  background-color: ${p => (p.receiving ? "yellow" : "")};
  border: ${p => (p.receiving ? "6px solid orange" : "")};
  box-sizing: content-box;
`

const SelectedRoomDrop = ({ children, roomId, addCardLocal }) => {
  const { myHouse } = useHouseCtx()
  const thisRoom = (myHouse && myHouse[roomId]) || []
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: (item, monitor) => {
      const canDrop =
        thisRoom &&
        thisRoom.length < maxItemsPerRoom &&
        monitor.isOver({ shallow: true })
      // don't accept it if this room is full

      // dont drop here if ALSO dragging over
      // ReorderPlaceholder (nested inside SelectedRoomDrop).
      // ReorderPlaceholder puts it at a specified index.
      // SelectedRoomDrop puts it at the end.
      return canDrop
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop()
    }),
    drop: ({ itemId }) => {
      addCardLocal({ itemId, index: thisRoom.length }) // this is optional.  makes it faster?
      return {
        droppedAt: roomId,
        index: thisRoom.length
      }
    }
  })
  return (
    <SelectRoomContainer receiving={isOver && canDrop} ref={dropRef}>
      {children}
    </SelectRoomContainer>
  )
}

export default SelectedRoomDrop
