import React, { memo } from "react"
import { useDrop } from "react-dnd"
import styled from "styled-components"
//
import PointsReactTransGroup from "./PointsReactTransGroup.jsx"
import { Room } from "../../house/RoomDnD/RoomDnD.jsx"
import { ItemTypes } from "../../../dnd/itemTypes"
import { WindowCard } from "../../house/DraggableCard.jsx"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx.js"
import isEqual from "lodash/isEqual"
import CenterPlate from "./CenterPlateSvg.jsx"
//
//
const TableHalo = styled.div`
  /* transform: scaleY(0.9); */
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  border: 1px solid lightgreen;
  border-radius: 50%;
  box-shadow: 1px 0px 20px 7px #2fdc36;
`
const CenterSquareContainer = () => {
  const { gamePlay } = useGamePlayCtx("CenterSquare")
  const centerCardPile = (gamePlay && gamePlay.centerCardPile) || []
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: () => true,
    drop: (item, monitor) => {
      console.log("item dropped in center", item)
      return { droppedAt: "center" }
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop()
    })
  })
  console.log("rendering DnD CENTER container")
  return (
    <CenterSquare
      dropRef={dropRef}
      isOver={isOver}
      canDrop={canDrop}
      centerCardPile={centerCardPile}
    />
  )
}

const CenterSquare = ({ centerCardPile, dropRef, isOver, canDrop }) => {
  return (
    <div ref={dropRef}>
      <CenterPlate canDrop={canDrop} isOver={isOver}>
        <PileOfCards centerCardPile={centerCardPile} />
        <PointsReactTransGroup key="reactTransGroup" />
      </CenterPlate>
    </div>
  )
}

const PileOfCards = memo(({ centerCardPile }) => {
  console.log("rendering pile of cards")
  return centerCardPile.map((itemId, index) => {
    return (
      <WindowCard scale={1.5} index={index + 2} key={itemId} itemId={itemId} />
    )
  })
}, propsEqual)

function propsEqual(prev, next) {
  return isEqual(prev, next)
}

export default CenterSquareContainer
