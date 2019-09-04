import React from "react"
import styled from "styled-components"
import { IconButton } from "@material-ui/core"
import { useDrag } from "react-dnd"
import { FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa"
//
import SorterCard from "./SorterCard"
import { ItemTypes } from "../../../dnd/itemTypes"

import { useGameCtx } from "../../../contexts/GameCtx"
import { useGameFxns } from "../../../hooks/useGameFxns"
import { useAuthCtx } from "../../../contexts/AuthCtx"
//
//
const CardAndButtons = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-items: center;
`
const ResortableDnDCard = ({
  faceUp,
  itemId,
  roomId,
  index,
  isFirst,
  isLast,
  disableButtons,
  restartTimer
}) => {
  const { reorderRoomFX } = useGameFxns()
  function handleUp() {
    if (isFirst) return null
    reorderRoomFX({ itemId, roomId, sourceIndex: index, destIndex: index - 1 })
    restartTimer()
  }
  function handleDown() {
    if (isLast) return null
    reorderRoomFX({ itemId, roomId, sourceIndex: index, destIndex: index + 1 })
    restartTimer()
  }
  return (
    <CardAndButtons>
      {disableButtons || isFirst ? (
        <div />
      ) : (
        <IconButton onClick={handleUp}>
          {!isFirst && <FaArrowCircleUp />}
        </IconButton>
      )}
      <DnDCard faceUp={faceUp} itemId={itemId} roomId={roomId} />
      {disableButtons || isLast ? (
        <div />
      ) : (
        <IconButton onClick={handleDown}>
          {!isLast && <FaArrowCircleDown />}
        </IconButton>
      )}
    </CardAndButtons>
  )
}

export default ResortableDnDCard

const DnDCard = ({ faceUp, itemId, roomId }) => {
  // this is a card from the house.   does not end the turn.
  const { gamePlay } = useGameCtx()
  const { houseToCenterFX } = useGameFxns()
  const { user } = useAuthCtx()
  const isMyTurn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid
  const canPlay = isMyTurn && !faceUp
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: ItemTypes.CARD, itemId, fromStorage: false, roomId },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag: canPlay
  })
  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: `rotate(${isDragging ? 10 : 0}deg)`
      }}
      onDoubleClick={() => {
        canPlay
          ? houseToCenterFX({ roomId, itemId })
          : console.log("not your turn")
      }}
    >
      <SorterCard faceUp={faceUp} key={itemId} itemId={itemId}>
        {itemId}
      </SorterCard>
    </div>
  )
}
