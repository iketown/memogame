import React, { useMemo } from "react"
import styled from "styled-components"
import { useWidth, useWiderThan } from "../../hooks/useWidth"
import { Card, Avatar } from "@material-ui/core"
import { useDrag, DragPreviewImage } from "react-dnd"
//
import { imageFromItemId } from "../../images/cards/index"
import { houseDimensions } from "./HouseGrid.jsx"
import { ItemTypes } from "../../dnd/itemTypes"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { useGameCtx } from "../../contexts/GameCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import { useItemCtx } from "../../contexts/ItemContext"
import { removeUid } from "../../utils/imageUtils"
//
//
const NewDraggableCard = ({ itemId, scale, index }) => {
  const { gamePlay } = useGameCtx()
  const { user } = useAuthCtx()
  const isMyTurn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid
  const {
    gameState: { gameId }
  } = useGameCtx()
  const [{ isDragging }, dragRef, preview] = useDrag({
    item: { type: ItemTypes.CARD, itemId, fromStorage: true },
    end: async (item, mon) => {
      // console.log("drop result", mon.getDropResult())
      // const endTurnResponse = await endTurn({ gameId })
      // console.log("end turn resonse", endTurnResponse)
      // end the turn here.
    },
    collect: mon => ({
      isDragging: !!mon.isDragging()
    }),
    canDrag: isMyTurn
  })
  return (
    <>
      <div
        ref={dragRef}
        style={{
          opacity: isDragging ? 0.5 : 1,
          zIndex: 200,
          cursor: isDragging ? "grabbing" : isMyTurn ? "grab" : "not-allowed"
        }}
      >
        <WindowCard index={index} itemId={itemId} scale={scale} dragMe />
      </div>
    </>
  )
}

export default NewDraggableCard

const offsetMultiplier = 2
const StyledCard = styled(Card)`
  height: ${p => p.heightwidth};
  width: ${p => p.heightwidth};
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${p => p.imagesvg});
  background-size: cover;
  z-index: ${p => 200 - p.index};
  position: absolute;
`
const BackgroundCard = styled(StyledCard)`
  top: ${p => p.index * offsetMultiplier}px;
  transform: scale(${p => 1 - p.index * 0.02}) rotate(${p => p.rotation}deg);
`

export const WindowCard = ({ index, itemId, scale = 1, dragMe }) => {
  const { allItems } = useItemCtx()
  const mdUp = useWiderThan("md")
  const { imagesvg, rotation } = useMemo(() => {
    const imagesvg = index < 5 && itemId ? allItems[removeUid(itemId)].card : ""
    const rotation = (Math.random() - 0.5) * 18 + index // adding index makes the pile twirl
    return { imagesvg, rotation }
  }, [allItems, index, itemId])

  const windowHeight = mdUp ? 90 : 65
  const cardProps = {
    heightwidth: `${windowHeight * scale}px`,
    index,
    imagesvg,
    rotation,
    className: `cards card${index}`
  }
  return dragMe ? (
    <StyledCard {...cardProps} />
  ) : (
    <BackgroundCard {...cardProps} />
  )
}

export const BackgroundPile = () => {}
