import React, { memo } from "react"
import { useDrop } from "react-dnd"
import styled from "styled-components"
//
import PointsReactTransGroup from "./PointsReactTransGroup.jsx"
import { ItemTypes } from "../../../dnd/itemTypes"
import { WindowCard } from "../../house/DraggableCard.jsx"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx.js"
import isEqual from "lodash/isEqual"
import CenterPlate from "./CenterPlateSvg.jsx"
//
//

const CenterSquareContainer = () => {
  const {
    gamePlay: { centerCardPile }
  } = useGamePlayCtx("CenterSquareContainer")
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
  console.log("CenterSquare rendering container")
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
  console.log("CenterSquare rendering")
  return (
    <div ref={dropRef}>
      <CenterPlate canDrop={canDrop} isOver={isOver}>
        <PileOfCards centerCardPile={centerCardPile} />
        <PointsReactTransGroup key="reactTransGroup" />
      </CenterPlate>
    </div>
  )
}

const PileOfCards = memo(({ centerCardPile = [] }) => {
  console.log("CenterSquare rendering pile of cards", centerCardPile)
  return centerCardPile.map((itemId, index) => {
    return (
      <WindowCard scale={1.5} index={index + 2} key={itemId} itemId={itemId} />
    )
  })
}, propsEqual)

function propsEqual(prev, next) {
  console.log("CenterSquare props", prev, next)
  return isEqual(prev, next)
}

export default CenterSquareContainer
