import React from "react"
import { Draggable } from "react-beautiful-dnd"
//
import { CircleDot } from "./House.jsx"

const DialogDot = ({ dragId, index }) => {
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
          <CircleDot>{dragId}</CircleDot>
        </div>
      )}
    </Draggable>
  )
}

export default DialogDot
