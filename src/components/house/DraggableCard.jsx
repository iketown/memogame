import React from "react"
import { Draggable } from "react-beautiful-dnd"
import styled from "styled-components"
import { useItemCtx } from "../../contexts/ItemContext"
import { removeUid } from "../../utils/imageUtils"
import brain from "../../images/newCards/brain.svg"
import { useGameCtx } from "../../contexts/GameCtx"
import ShowMe from "../../utils/ShowMe"
import { userInfo } from "os"
import { useAuthCtx } from "../../contexts/AuthCtx"
import { defaultHeight } from "../ItemCard.jsx"

export const StyledCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${p => p.height || defaultHeight};
  width: ${p => p.height || defaultHeight};
  background-image: url(${p => p.cardImage});
  background-color: white;
  background-size: contain;
  border: 2px solid black;
  /* border-radius: 50%; */
  font-weight: bold;
  font-size: 2rem;
  transform: scale(${p => (p.isDragging ? 0.5 : 1)});
  transition: transform 0.2s;
  z-index: 2;
`

const DraggableCard = ({ index, dragId, flipped, height }) => {
  const { imagesObj } = useItemCtx()
  const { gamePlay } = useGameCtx()
  const { user } = useAuthCtx()
  const turnUid = gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid
  const myTurn = turnUid && user && turnUid === user.uid
  const dragChip = (
    <Draggable isDragDisabled={!myTurn} draggableId={dragId} index={index}>
      {({ dragHandleProps, draggableProps, innerRef }, { isDragging }) => (
        <div
          {...dragHandleProps}
          {...draggableProps}
          ref={innerRef}
          index={index}
          className="drag-dot"
        >
          <StyledCard
            cardImage={flipped ? brain : imagesObj[removeUid(dragId)]}
            isDragging={isDragging}
            height={height}
          />
        </div>
      )}
    </Draggable>
  )
  return dragChip
}

export default DraggableCard
