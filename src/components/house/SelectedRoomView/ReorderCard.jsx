import React, { useState } from "react"
import styled from "styled-components"
import { useDrag, useDrop } from "react-dnd"
import { ItemTypes } from "../../../dnd/itemTypes"
import { WindowCard } from "../DraggableCard.jsx"
import { useHouseCtx, usePointsCtx } from "../../../contexts/GameCtx"
import { IconButton } from "@material-ui/core"
import { FaEye } from "react-icons/fa"
import { useGameFxns } from "../../../hooks/useGameFxns"
import { useGameCtx } from "../../../contexts/GameCtx"
import { useAuthCtx } from "../../../contexts/AuthCtx"
const style = {
  width: "8rem",
  height: "8rem",
  cursor: "move",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

const ReorderCard = ({
  roomId,
  thisRoom,
  index,
  moveCard,
  findCard,
  itemId
}) => {
  const { selectedRoom } = useHouseCtx()
  const originalIndex = findCard(itemId).index
  const [peek, setPeek] = useState(false)
  const { subtractAPointFX, houseToCenterFX } = useGameFxns()
  const { resetPointsClimber } = usePointsCtx()
  const { gamePlay } = useGameCtx()
  const { user } = useAuthCtx()
  const isMyTurn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid
  function peekAtCard() {
    setPeek(true)
    subtractAPointFX()
    resetPointsClimber()
    setTimeout(() => setPeek(false), 2000)
  }
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, itemId, originalIndex },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    }),
    end: async (item, mon) => {
      console.log("mon get drop result", mon.getDropResult())
      if (mon.getDropResult()) {
        const { droppedAt, index } = mon.getDropResult()
        if (droppedAt === "center") {
          // handle dropped in center
          if (selectedRoom.faceUp || peek) resetPointsClimber()
          houseToCenterFX({ itemId, roomId })
        } else {
          // handle dropped in house
          // no action.
        }
      }
    },
    canDrag: () => isMyTurn
  })
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: ({ itemId }, monitor) => {
      if (selectedRoom.faceUp) {
        return true
      }
      if (!thisRoom.includes(itemId)) {
        // if this card is coming from storage
        // slotting between facedown cards is ok.
        return true
      }
      return false
    },
    collect: mon => ({
      isOver: !!mon.isOver()
    }),
    hover({ itemId: draggedId }) {
      // this moves the card around in local state.  the drop fxn
      // makes the change on fb.
      if (draggedId !== itemId) {
        const { index: overIndex } = findCard(itemId)
        if (thisRoom.includes(draggedId)) {
          if (selectedRoom.faceUp) {
            moveCard(draggedId, overIndex)
          }
        }
      }
    },
    drop: (item, monitor) => {
      // handle reorder on FS
      return { droppedAt: roomId, index }
    }
  })
  const opacity = isDragging ? 0.5 : 1
  function handleDoubleClick() {
    if (selectedRoom.faceUp || peek) resetPointsClimber()
    houseToCenterFX({ itemId, roomId })
  }
  return (
    <div style={{ position: "relative" }}>
      <div ref={node => drag(drop(node))} style={{ ...style, opacity }}>
        <WindowCard
          faceUp={selectedRoom.faceUp || peek}
          dragMe
          index={1}
          itemId={itemId}
          handleDoubleClick={handleDoubleClick}
        />
      </div>
      {!peek && !selectedRoom.faceUp && (
        <IconButton
          onClick={peekAtCard}
          style={{
            transform: "translate(4rem, -5.5rem)",
            position: "absolute"
          }}
        >
          <FaEye />
        </IconButton>
      )}
    </div>
  )
}
export default ReorderCard
