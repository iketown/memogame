import React from "react"
import { Droppable } from "react-beautiful-dnd"
import styled from "styled-components"
import { useHouseCtx } from "./houseContext"
import { DragDot } from "./House"

//
//
const StylePile = styled.div`
  border: 1px solid black;
  .drag-dot {
    display: inline-block;
  }
`
const FaceUpHousePile = () => {
  const { state, dispatch } = useHouseCtx()
  const cardArr = state.faceUpPile
  return (
    <Droppable droppableId="faceUpPile">
      {({ droppableProps, innerRef }) => (
        <StylePile {...droppableProps} ref={innerRef}>
          <DragDot index={0} dragId={cardArr[0]} />
        </StylePile>
      )}
    </Droppable>
  )
}

export default FaceUpHousePile
