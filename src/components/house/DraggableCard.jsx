import React, { useMemo, useRef, memo } from "react"
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
import { useGamePlayCtx } from "../../contexts/GamePlayCtx"
import { useGameFxnsLOC } from "../../hooks/useGameFxnsLOC"
// import { useClickMoveCtx } from "../../contexts/ClickMoveCtx"
//
//

const DraggableCard = ({ itemId, scale, index, source }) => {
  // draggableCard is the top card in the storage pile.
  console.log("draggableCard renders", itemId, scale, index, source)
  const { gamePlay } = useGamePlayCtx("DraggableCard")
  const { storageToCenter, storageToHouse } = useGameFxnsLOC()
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
          // storageToCenterFX({ itemId })
          storageToCenter({ itemId })
        } else {
          // handle dropped in house
          storageToHouse({ itemId, roomId: droppedAt, index })
          // storageToHouseFX({ roomId: droppedAt, itemId, index })
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
          ? () => storageToCenter({ itemId })
          : () => console.log("not your turn")
      }
      ref={dragRef}
      style={{
        opacity: isDragging ? 0 : 1,
        zIndex: 200,
        cursor: isDragging ? "grabbing" : isMyTurn ? "grab" : "not-allowed"
      }}
    >
      <WindowCard index={index} itemId={itemId} scale={scale} dragMe />
    </div>
  )
}

export default DraggableCard

const offsetMultiplier = 1.5

const StyledCard = styled(Card)`
  height: ${p => p.heightwidth};
  width: ${p => p.heightwidth};
  /* display: flex;
  justify-content: center;
  align-items: center; */
  background-image: url(${p => p.imagesvg});
  background-size: cover;
  z-index: ${p => 200 - p.index};
  position: absolute;
  top: calc(50% + ${p => p.index * offsetMultiplier}px);
  left: 50%;
  transform: translate(-50%, -50%);
  border: 5px solid white;
`

const BackgroundCard = styled(StyledCard)`
  transform: translate(-50%, -50%) scale(${p => 1 - p.index * 0.02})
    rotate(${p => p.rotation}deg);
`

export const WindowCard = memo(
  ({
    index = 0,
    itemId,
    scale = 1,
    dragMe,
    faceUp = true,
    handleDoubleClick = () => null
  }) => {
    const mdUp = useWiderThan("md")
    const { imagesvg, rotation } = useMemo(() => {
      console.log("memoing WindowCard")
      const imagesvg =
        faceUp && itemId
          ? allItems[removeUid(itemId)] && allItems[removeUid(itemId)].card
          : brain
      const rotation = (Math.random() - 0.5) * 30
      return { imagesvg, rotation }
    }, [faceUp, itemId])

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
  },
  areEqual
)
function areEqual(prevProps, nextProps) {
  // dont rerender if the index is still greater than 4.  (dont keep rerendering the bottom cards in the pile)
  const dontReprint = nextProps.index > 3
  return dontReprint
}

export const BackgroundPile = () => {}
