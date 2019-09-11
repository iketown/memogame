import React from "react"
import { useDrop } from "react-dnd"
import styled from "styled-components"
//
import PointsReactTransGroup from "./PointsReactTransGroup.jsx"
import { HouseContainer } from "../../house/House.responsive.jsx"
import { Room } from "../../house/RoomDnD/RoomDnD.jsx"
import { ItemTypes } from "../../../dnd/itemTypes"
import { useGameFxns } from "../../../hooks/useGameFxns"
import { useCenterPileCtx } from "../../../contexts/GameCtx.js"
import { WindowCard } from "../../house/DraggableCard.jsx"
// import { useClickMoveCtx } from "../../../contexts/ClickMoveCtx.js"
//
//
const offset = 0
const TableHalo = styled.div`
  /* transform: scaleY(0.9); */
  position: absolute;
  top: -${offset}px;
  bottom: -${offset}px;
  left: -${offset}px;
  right: -${offset}px;
  border: 1px solid lightgreen;
  border-radius: 50%;
  box-shadow: 1px 0px 20px 7px #2fdc36;
`

const CenterSquare = () => {
  const { centerPile = [] } = useCenterPileCtx()
  // const { cancelMovingCard } = useClickMoveCtx()
  const [{ isOver }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: () => true,
    drop: (item, monitor) => {
      console.log("item dropped in center", item)
      // cancelMovingCard()
      const { source, itemId } = item
      return { droppedAt: "center" }

      //   if (source === "storage") {
      //     storageToCenterFX({ itemId })
      //   } else {
      //     houseToCenterFX({ roomId: source, itemId })
      //     // handle closing selected room
      //     // setExpandedRoom({ roomId: false })
      //   }
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop()
    })
  })
  return (
    <HouseContainer ref={dropRef}>
      {centerPile.map((itemId, index) => (
        <WindowCard
          scale={1.5}
          index={index + 2}
          key={itemId}
          itemId={itemId}
        />
      ))}
      {isOver && <TableHalo />}
      <Room title="center pile">center pile</Room>
      <PointsReactTransGroup />
    </HouseContainer>
  )
}

export default CenterSquare
