import React, { memo } from "react"
import { useDrop } from "react-dnd"
//
import PointsReactTransGroup from "./PointsReactTransGroup.jsx"
import { ItemTypes } from "../../../dnd/itemTypes"
import { WindowCard } from "../../house/DraggableCard.jsx"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx.js"
import isEqual from "lodash/isEqual"
import CenterPlate from "./CenterPlateSvg.jsx"
import Blinker from "../Scores/Blinker.jsx"
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
      return { droppedAt: "center" }
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop()
    })
  })
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
        <Blinker displayPlayer="all" circular={true} />
        <PileOfCards centerCardPile={centerCardPile} />
        <PointsReactTransGroup key="reactTransGroup" />
      </CenterPlate>
    </div>
  )
}

const PileOfCards = memo(({ centerCardPile = [] }) => {
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
