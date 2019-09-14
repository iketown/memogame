import React, { useMemo } from "react"
import styled from "styled-components"
import { useWiderThan } from "../../hooks/useScreenSize"
import { Card } from "@material-ui/core"
import { useDrag } from "react-dnd"
import brain from "../../images/newCards/brain.svg"
//
import { ItemTypes } from "../../dnd/itemTypes"
import { useAuthCtx } from "../../contexts/AuthCtx"
import { removeUid } from "../../resources/allItems"
import allItems from "../../resources/allItems"
import { useGameFxns } from "../../hooks/useGameFxns"
import { useGamePlayCtx } from "../../contexts/GamePlayCtx"
// import { useClickMoveCtx } from "../../contexts/ClickMoveCtx"
//
//

const DraggableCard = ({ itemId, scale, index, source }) => {
  // draggableCard is the top card in the storage pile.
  console.log("draggableCard renders", itemId, scale, index, source)
  const { gamePlay } = useGamePlayCtx("DraggableCard")
  const { storageToCenterFX, storageToHouseFX } = useGameFxns("DraggableCard")
  const { user } = useAuthCtx()
  const isMyTurn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid
  const [{ isDragging }, dragRef] = useDrag({
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
  const mdUp = useWiderThan("md")
  const { imagesvg, rotation } = useMemo(() => {
    const imagesvg =
      faceUp && index < 5 && itemId
        ? allItems[removeUid(itemId)] && allItems[removeUid(itemId)].card
        : brain
    const rotation = (Math.random() - 0.5) * 18 + index // adding index makes the pile twirl
    return { imagesvg, rotation }
  }, [faceUp, index, itemId])

  const windowHeight = mdUp ? 90 : 65
  const cardProps = {
    heightwidth: `${windowHeight * scale}px`,
    index,
    imagesvg,
    rotation,
    className: `cards card${index}`
  }
  return dragMe ? (
    <StyledCard onDoubleClick={handleDoubleClick} {...cardProps} />
  ) : (
    <BackgroundCard {...cardProps} />
  )
}

export const BackgroundPile = () => {}
