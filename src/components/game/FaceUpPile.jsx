import React from "react"
import { Droppable } from "react-beautiful-dnd"
//
import { useGameCtx } from "../../hooks/useGameCtx"
import ShowMe from "../../utils/ShowMe"
import ItemCard from "../ItemCard"
import { useItemCtx } from "../../contexts/ItemContext"
import { StyledRoom, RoomTitle } from "./Room.jsx"
//
//
const FaceUpPile = () => {
  const { state } = useGameCtx()
  const { allItems } = useItemCtx()
  const topItemId = state.faceUpPile && state.faceUpPile.items[0]
  console.log("topItemId", topItemId)
  console.log("count", state.faceUpPile.items.length)
  const item = allItems[topItemId]
  return (
    <StyledRoom>
      <RoomTitle variant="overline">
        Face up Pile: {state.faceUpPile.items.length}
      </RoomTitle>
      <Droppable droppableId="faceUpPile">
        {({ droppableProps, innerRef }) => (
          <div {...droppableProps} ref={innerRef}>
            {item && <ItemCard item={item} index={0} />}
          </div>
        )}
      </Droppable>
    </StyledRoom>
  )
}

export default FaceUpPile
