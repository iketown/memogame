import React from "react"
import { Draggable } from "react-beautiful-dnd"
import styled from "styled-components"
import { useItemCtx } from "../../contexts/ItemContext"
import brain from "../../images/cards/brain.svg"

const boxHeight = "5rem"

export const StyledCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${p => p.height || boxHeight};
  width: ${p => p.height || boxHeight};
  background-color: white;
  background-image: url(${p => p.cardImage});
  background-size: contain;
  border: 2px solid black;
  /* border-radius: 50%; */
  font-weight: bold;
  font-size: 2rem;
`

const DraggableCard = ({ index, dragId, flipped }) => {
  const { imagesObj } = useItemCtx()

  const dragChip = (
    <Draggable draggableId={dragId} index={index}>
      {({ dragHandleProps, draggableProps, innerRef }) => (
        <div
          {...dragHandleProps}
          {...draggableProps}
          ref={innerRef}
          index={index}
          className="drag-dot"
        >
          <StyledCard
            cardImage={flipped ? brain : imagesObj[dragId]}
            height="5rem"
          />
        </div>
      )}
    </Draggable>
  )
  return dragChip
}

export default DraggableCard
