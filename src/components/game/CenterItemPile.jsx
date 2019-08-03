import React from "react"
import { Droppable } from "react-beautiful-dnd"
import styled from "styled-components"
//
import { useGameCtx } from "../../hooks/useGameCtx"
import ItemCard from "../ItemCard.jsx"
import { useItemCtx } from "../../contexts/ItemContext"
import { StyledRoom, RoomTitle } from "./Room.jsx"
//
//
const DropZone = styled.div`
  border: 1px solid grey;
  min-width: 10rem;
  min-height: 10rem;
`
//

const CenterItemPile = () => {
  const { state } = useGameCtx()
  const { allItems } = useItemCtx()
  const itemIds = (state.centerPile && state.centerPile.items) || []
  const topCardId = itemIds[0]
  return (
    <Droppable droppableId="centerPile">
      {({ droppableProps, innerRef }) => {
        return (
          <StyledRoom {...droppableProps} ref={innerRef}>
            <RoomTitle variant="overline">
              Center Pile: {state.centerPile.items.length}
            </RoomTitle>
            {topCardId && <ItemCard noDrag item={allItems[topCardId]} />}
          </StyledRoom>
        )
      }}
    </Droppable>
  )
}

export default CenterItemPile
