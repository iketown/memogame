import React, { useState, useRef } from "react"
import styled from "styled-components"
import { Droppable, Draggable } from "react-beautiful-dnd"
import { Typography, Button, Menu, MenuList, MenuItem } from "@material-ui/core"
//
import { useGameCtx, maxItems } from "../../hooks/useGameCtx"
import { useItemCtx } from "../../contexts/ItemContext"
import ItemCard, { CardBack } from "../ItemCard"
import ShowMe from "../../utils/ShowMe"
//
export const StyledRoom = styled.div`
  border: 1px dotted grey;
  width: 15rem;
  height: 10rem;
  position: relative;
  background: ${p => (p.isDraggingOver ? "lightblue" : "white")};
  .expanding-card {
    transform: scale(${p => (p.isDraggingOver ? "1.5" : "1")});
    margin-top: ${p => (p.isDraggingOver ? "2rem" : "8px")};
    transition: 0.5s transform;
  }
`
export const RoomTitle = styled(Typography)`
  /* position: absolute; */
  top: 0;
  background: white;
  padding: 0 3px;
  left: 50%;
  /* transform: translateX(-50%); */
`
//
//
const Room = ({ roomId, roomName }) => {
  const { state, confirmRoom } = useGameCtx()
  const { allItems } = useItemCtx()
  const itemIds = (state[roomId] && state[roomId].items) || []
  const awaitingConf = state[roomId] && state[roomId].awaitingConfirmation

  return (
    <Droppable
      isDropDisabled={itemIds.length >= maxItems}
      droppableId={roomId}
      style={{ position: "relative" }}
    >
      {({ droppableProps, innerRef, placeholder }, { isDraggingOver }) => {
        return (
          <StyledRoom
            ref={innerRef}
            {...droppableProps}
            isDraggingOver={isDraggingOver && itemIds.length < maxItems}
          >
            <RoomTitle variant="overline">{roomName}</RoomTitle>

            {awaitingConf && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => confirmRoom(roomId)}
              >
                ok
              </Button>
            )}
            <div>
              {itemIds.map((itemId, index) => (
                <ItemCard
                  key={itemId}
                  item={allItems[itemId]}
                  index={index}
                  faceDown={!awaitingConf}
                />
              ))}
              {placeholder}
            </div>
          </StyledRoom>
        )
      }}
    </Droppable>
  )
}

export default Room
