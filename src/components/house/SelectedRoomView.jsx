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
import { useDrag } from "react-dnd"
//
import kitchen from "../../images/rooms/kitchen.jpg"
import garage from "../../images/rooms/garage.jpg"
import bathroom from "../../images/rooms/bathroom.jpg"
import bedroom from "../../images/rooms/bedroom.jpg"
import cellar from "../../images/rooms/cellar.jpg"
import attic from "../../images/rooms/attic.jpg"
import family from "../../images/rooms/family.jpg"
import brain from "../../images/cards/brain.svg"
import { ItemTypes } from "../../dnd/itemTypes"
import { imageFromItemId } from "../../images/cards/index"
import { useHouseGridCtx } from "../../contexts/HouseGridCtx"
import { useWiderThan } from "../../hooks/useWidth"
import { useGameCtx, useHouseCtx } from "../../contexts/GameCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { useItemCtx } from "../../contexts/ItemContext"
import { removeUid } from "../../utils/imageUtils"
//

const roomImages = {
  kitchen,
  garage,
  bathroom,
  bedroom,
  cellar,
  attic,
  family
}

const StyledSelectedRoom = styled.div`
  grid-area: 1 / 1 / -1 / -1;
  position: relative;
  z-index: 20;
  height: 100%;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  .card {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffffcc;
    .content {
      flex-grow: 1;
    }
  }
  .card::before {
    /* card background image */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${p => roomImages[p.room]});
    background-size: cover;
    background-position: center;
    content: "";
    z-index: -1;
    filter: blur(1px);
  }
  .transparent {
    background: none;
  }
`

const MakeDroppable = ({ droppableId, children }) => {
  return (
    <Droppable droppableId={droppableId}>
      {({ droppableProps, innerRef, placeholder }) => (
        <div {...droppableProps} ref={innerRef} className="card">
          {children}
          {placeholder}
        </div>
      )}
    </Droppable>
  )
}

const MakeDraggable = ({ draggableId, index, children }) => {
  const { gamePlay } = useGameCtx()
  const { user } = useAuthCtx()
  const isMyTurn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid

  return (
    <Draggable draggableId={draggableId} index={index}>
      {({ dragHandleProps, draggableProps, innerRef }) => (
        <div ref={innerRef} {...dragHandleProps} {...draggableProps}>
          {children}
        </div>
      )}
    </Draggable>
  )
}

const SelectedRoomView = () => {
  const { expandedRoom, setExpandedRoom } = useHouseGridCtx()
  const { houseToHouse } = useFirebase()
  const { myHouse, reorderRoomLocal } = useHouseCtx()
  const {
    gameState: { gameId }
  } = useGameCtx()
  if (!expandedRoom || !expandedRoom.roomId) return null
  const { roomId, faceUp } = expandedRoom
  const thisRoom = myHouse[roomId] || []

  async function onDragEnd(result) {
    console.log("result", result)
    const { source, destination, draggableId: itemId } = result
    if (!destination) return null
    const { index: sourceIndex } = source
    const { index: destIndex } = destination
    if (sourceIndex === destIndex) return null
    reorderRoomLocal({ itemId, roomId, sourceIndex, destIndex })
    const objForFirebase = {
      gameId,
      itemId,
      roomId,
      sourceIndex,
      destIndex
    }
    console.log("objForFirebase", objForFirebase)
    const houseToHouseResponse = await houseToHouse(objForFirebase)
    console.log("houseToHouseResponse", houseToHouseResponse)
    // { itemId, roomId, fromIndex, toIndex }
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <SelectedRoomCard
        {...{ roomId, thisRoom, faceUp, setExpandedRoom }}
        enableBeautifulDragDrop={!!faceUp}
      />
    </DragDropContext>
  )
}

const SelectedRoomCard = ({
  roomId,
  thisRoom,
  faceUp,
  setExpandedRoom,
  enableBeautifulDragDrop
}) => {
  const cardContents = (
    <>
      <Typography variant="h5">{roomId.toUpperCase()}</Typography>
      <CardContent className="content">
        {thisRoom.map((itemId, index) => {
          if (enableBeautifulDragDrop)
            return (
              <MakeDraggable key={itemId} draggableId={itemId} index={index}>
                <SorterCard faceUp={faceUp} key={itemId} itemId={itemId}>
                  {itemId}
                </SorterCard>
              </MakeDraggable>
            )
          return (
            <DnDCard
              key={itemId}
              faceUp={faceUp}
              itemId={itemId}
              roomId={roomId}
            />
          )
        })}
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
    </>
  )
  return (
    <StyledSelectedRoom room={roomId}>
      {enableBeautifulDragDrop ? (
        <MakeDroppable droppableId={roomId}>
          <Card className="card transparent">{cardContents}</Card>
        </MakeDroppable>
      ) : (
        <Card className="card">{cardContents}</Card>
      )}
    </StyledSelectedRoom>
  )
}

export default SelectedRoomView

const StyledSorterCard = styled(Card)`
  width: ${p => p.width}rem;
  height: ${p => p.width}rem;
  background-image: url(${p => p.image});
  background-size: cover;
  padding: 5px;
  margin: 8px;
`
const SorterCard = ({ itemId, faceUp }) => {
  const { allItems } = useItemCtx()
  const image = faceUp ? allItems[removeUid(itemId)].card : brain
  const mdUp = useWiderThan("md")
  return <StyledSorterCard width={mdUp ? 6.5 : 4.5} image={image} />
}

const DnDCard = ({ faceUp, itemId, roomId }) => {
  // this is a card from the house.   does not end the turn.
  const { gamePlay } = useGameCtx()
  const { user } = useAuthCtx()
  const isMyTurn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid

  const [{ isDragging }, dragRef, preview] = useDrag({
    item: { type: ItemTypes.CARD, itemId, fromStorage: false, roomId },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag: isMyTurn
  })
  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: `rotate(${isDragging ? 10 : 0}deg)`
      }}
    >
      <SorterCard faceUp={faceUp} key={itemId} itemId={itemId}>
        {itemId}
      </SorterCard>
    </div>
  )
}
