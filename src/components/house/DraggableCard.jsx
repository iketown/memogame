import React, { useMemo } from "react"
import styled from "styled-components"
import { useWiderThan } from "../../hooks/useScreenSize"
import { Card, Avatar } from "@material-ui/core"
import { useDrag, DragPreviewImage } from "react-dnd"
import brain from "../../images/newCards/brain.svg"
//
import { ItemTypes } from "../../dnd/itemTypes"
import { useGameCtx } from "../../contexts/GameCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import { removeUid } from "../../utils/imageUtils"
import { useAllItemsCtx } from "../../contexts/AllItemsCtx"
import { useGameFxns } from "../../hooks/useGameFxns"
// import { useClickMoveCtx } from "../../contexts/ClickMoveCtx"
//
//

const DraggableCard = ({ itemId, scale, index, source }) => {
  // draggableCard is the top card in the storage pile.
  const { gamePlay } = useGameCtx()
  const { storageToCenterFX, storageToHouseFX } = useGameFxns()
  const { user } = useAuthCtx()
  // const { toggleMovingItem, movingItem, cancelMovingCard } = useClickMoveCtx()
  const isMyTurn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid

  const [{ isDragging }, dragRef, preview] = useDrag({
    item: { type: ItemTypes.CARD, itemId, source },
    end: async (item, mon) => {
      console.log("mon get drop result", mon.getDropResult())
      // cancelMovingCard()
      if (mon.getDropResult()) {
        const { droppedAt, index } = mon.getDropResult()
        if (droppedAt === "center") {
          // handle dropped in center
          storageToCenterFX({ itemId })
        } else {
          // handle dropped in house

          storageToHouseFX({ roomId: droppedAt, itemId, index })
        }
      }
    },
    collect: mon => ({
      isDragging: !!mon.isDragging()
    }),
    canDrag: isMyTurn
  })
  if (!itemId) return null
  return (
    <div
      // onClick={() => toggleMovingItem({ itemId, source })}
      onDoubleClick={
        isMyTurn
          ? () => storageToCenterFX({ itemId })
          : () => console.log("not your turn")
      }
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        zIndex: 200,
        cursor: isDragging ? "grabbing" : isMyTurn ? "grab" : "not-allowed",
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <WindowCard index={index} itemId={itemId} scale={scale} dragMe />
    </div>
  )
}

export default DraggableCard

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
  border: 5px solid white;
`
const CardWithHalo = styled(StyledCard)`
  @keyframes shimmy {
    0% {
      transform: scale(1);
    }

    100% {
      transform: scale(1.1);
      box-shadow: 8px 8px 6px #4444444d;
    }
  }
  ${p =>
    p.waitingToDrop
      ? `
    border: 2px solid black;
  animation: shimmy 1s infinite;
  `
      : ``}
`
const BackgroundCard = styled(StyledCard)`
  top: ${p => p.index * offsetMultiplier}px;
  transform: scale(${p => 1 - p.index * 0.02}) rotate(${p => p.rotation}deg);
  border: 5px solid white;
`

export const WindowCard = ({
  index = 0,
  itemId,
  scale = 1,
  dragMe,
  faceUp = true,
  handleDoubleClick = () => null
}) => {
  const { allItems } = useAllItemsCtx()
  // const { movingItem } = useClickMoveCtx()
  // const waitingToDrop = movingItem && movingItem.itemId === itemId
  const mdUp = useWiderThan("md")
  const { imagesvg, rotation } = useMemo(() => {
    const imagesvg =
      faceUp && index < 5 && itemId
        ? allItems[removeUid(itemId)] && allItems[removeUid(itemId)].card
        : brain
    const rotation = (Math.random() - 0.5) * 18 + index // adding index makes the pile twirl
    return { imagesvg, rotation }
  }, [allItems, faceUp, index, itemId])

  const windowHeight = mdUp ? 90 : 65
  const cardProps = {
    heightwidth: `${windowHeight * scale}px`,
    index,
    imagesvg,
    rotation,
    className: `cards card${index}`
  }
  return dragMe ? (
    <CardWithHalo
      onDoubleClick={handleDoubleClick}
      // waitingToDrop={waitingToDrop}
      {...cardProps}
    />
  ) : (
    <BackgroundCard {...cardProps} />
  )
}

export const BackgroundPile = () => {}
