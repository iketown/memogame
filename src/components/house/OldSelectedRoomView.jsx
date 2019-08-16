import React from "react"
import styled from "styled-components"
import {
  CardContent,
  Card,
  CardHeader,
  CardActions,
  Button,
  Typography
} from "@material-ui/core"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
//
import { imageFromItemId } from "../../images/cards/index"
import { useHouseGridCtx } from "../../contexts/HouseGridCtx"
//

const StyledSelectedRoom = styled.div`
  grid-area: 1 /1 / -1 / -1;
  z-index: 20;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .card {
    height: 90%;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffffe8;
    .content {
      flex-grow: 1;
    }
  }
`
const SelectedRoomView = () => {
  const {
    houseState,
    houseDispatch,
    expandedRoom,
    setExpandedRoom
  } = useHouseGridCtx()
  if (!expandedRoom || !expandedRoom.room) return null
  const { room, faceUp } = expandedRoom
  const thisRoom = houseState.house[room]
  console.log("thisRoom", thisRoom)
  console.log("house", houseState)
  function onDragEnd(result) {
    console.log("result", result)
    const { source, destination, draggableId: itemId } = result
    if (!destination) return null
    const { index: sourceIndex } = source
    const { index: destIndex } = destination
    if (sourceIndex === destIndex) return null
    houseDispatch({
      type: "REORDER_ROOM",
      room,
      sourceIndex,
      destIndex,
      itemId
    })
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={room}>
        {({ droppableProps, innerRef, placeholder }) => (
          <StyledSelectedRoom
            {...droppableProps}
            ref={innerRef}
            onClick={e => e.stopPropagation()}
          >
            <Card className="card">
              <Typography variant="h5">{room.toUpperCase()}</Typography>
              <CardContent className="content">
                {thisRoom.map((itemId, index) => (
                  <Draggable key={itemId} draggableId={itemId} index={index}>
                    {({ dragHandleProps, draggableProps, innerRef }) => (
                      <div
                        ref={innerRef}
                        {...dragHandleProps}
                        {...draggableProps}
                      >
                        <SorterCard
                          faceUp={faceUp}
                          key={itemId}
                          itemId={itemId}
                        >
                          {itemId}
                        </SorterCard>
                      </div>
                    )}
                  </Draggable>
                ))}
                {placeholder}
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setExpandedRoom({ open: false, roomId: "" })}
                >
                  ok
                </Button>
              </CardActions>
            </Card>
          </StyledSelectedRoom>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default SelectedRoomView

const StyledSorterCard = styled(Card)`
  width: 4rem;
  height: 4rem;
  background-image: url(${p => (p.faceUp ? p.image : "")});
  background-size: cover;
  padding: 5px;
  margin: 4px;
`
const SorterCard = ({ itemId, faceUp }) => {
  const image = imageFromItemId(itemId)
  return <StyledSorterCard faceUp={faceUp} image={image} />
}
