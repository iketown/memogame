import React from "react"
import { Draggable } from "react-beautiful-dnd"
//
import { StyledCard } from "./DraggableCard.jsx"
import { useItemCtx } from "../../contexts/ItemContext.js"

//
//
const DialogDot = ({ dragId, index }) => {
  const { imagesObj } = useItemCtx()
  return (
    <Draggable
      isDragDisabled={!dragId}
      draggableId={`dragger-${index}`}
      index={index}
    >
      {({ dragHandleProps, draggableProps, innerRef }) => (
        <div
          className="dot"
          {...dragHandleProps}
          {...draggableProps}
          ref={innerRef}
        >
          <StyledCard
            cardImage={dragId ? imagesObj[dragId] : ""}
            height={"8rem"}
          />
        </div>
      )}
    </Draggable>
  )
}

export default DialogDot
