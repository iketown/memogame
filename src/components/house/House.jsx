import React, { useReducer } from "react"
import styled from "styled-components"
import { Container, Grid, Avatar, Button, Typography } from "@material-ui/core"
import { FaCircle } from "react-icons/fa"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
//
import CenterPile from "../game/CenterPile.jsx"
import imgs from "../../images/index"
import { HouseCtxProvider, useHouseCtx } from "./houseContext"
import FaceUpHousePile from "./FaceUpHousePile"
import RoomDialog from "./RoomDialog"
import { useItemCtx } from "../../contexts/ItemContext"
import DraggableCard from "./DraggableCard.jsx"
import ShowMe from "../../utils/ShowMe"
import { useFirebase } from "../../contexts/FirebaseCtx.js"
import { useGameCtx } from "../../contexts/GameCtx.js"
import { useGamePlayCtx } from "../../contexts/GamePlayCtx.js"
import { useAuthCtx } from "../../contexts/AuthCtx.js"
//
//
const gridGap = "1rem"
const wallColor = "#3a3a3a"
const boxHeight = "5rem"
const HouseGrid = styled.div`
  width: 21rem;
  display: grid;
  grid-template-columns: 10rem 10rem;
  grid-template-rows: 20rem 20rem;
  border: ${gridGap} solid ${wallColor};
  grid-gap: ${gridGap};
  position: relative;
  &:after {
    content: "";
    z-index: -2;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: ${wallColor};
  }
  .room {
    position: relative;
    transition: transform 0.3s;
  }
  .room-name {
    position: absolute;
    writing-mode: vertical-lr;
    margin-top: 1rem;
    right: 0;
    color: white;
    font-size: 18px;
  }
  .room:after {
    background-size: cover;
    content: "";
    filter: blur(1px) saturate(40%) opacity(50%);
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    position: absolute;
    transition: 0.5s all;
    z-index: -1;
  }
  .bedroom::after {
    background-image: url(${imgs.bedroom.image});
  }
  .bath::after {
    background-image: url(${imgs.bathroom.image});
  }
  .garage::after {
    background-image: url(${imgs.garage.image});
  }
  .kitchen::after {
    background-image: url(${imgs.kitchen.image});
  }
  .room:hover {
    /* transform: scale(1.2); */
  }
  .room:hover:after {
    opacity: 0.9;
    filter: blur(0);
  }
`
const Floor = styled.div`
  display: grid;
  grid-template-rows: 26rem;
`

const House = ({ gameId }) => {
  return (
    <HouseCtxProvider gameId={gameId}>
      <HouseContents gameId={gameId} />
    </HouseCtxProvider>
  )
}

const HouseContents = ({ gameId }) => {
  const { state, dispatch } = useHouseCtx()
  const { state: responseState, dispatch: responseDispatch } = useGamePlayCtx()
  const { allItems } = useItemCtx()
  const {
    houseToCenter,
    faceUpToCenter,
    faceUpToHouse,
    houseToHouse
  } = useGamePlayCtx()
  const { gamePlay } = useGameCtx()

  const onDragEnd = result => {
    // TODO if its not your turn, nothing should happen
    console.log("result", result)
    if (!result.destination) return null
    const sourceId = result.source.droppableId
    const destId = result.destination.droppableId
    if (sourceId === destId) {
      // it wasnt moved (unless it was a dialog move 👆)
      return null
    }
    const topCardId =
      gamePlay && gamePlay.centerCardPile && gamePlay.centerCardPile[0]
    const { draggableId: cardId } = result
    if (sourceId === "dialog") {
      dispatch({ type: "REORDER-ROOM", result })
    }
    const fromFaceUp = sourceId === "faceUpPile"
    const toCenter = destId === "centerPile"
    if (!fromFaceUp && !toCenter) {
      // move within your own house (any time)
      houseToHouse({ sourceId, destId, cardId })
    }
    if (!fromFaceUp && toCenter) {
      // move card to center, dont end turn yet
      houseToCenter({ cardId, sourceId })
      responseDispatch({
        type: "OPEN_RESPONSE",
        itemId1: topCardId,
        itemId2: cardId
      })
    }
    if (fromFaceUp && toCenter) {
      faceUpToCenter({ cardId, sourceId })
      const response = responseDispatch({
        type: "OPEN_RESPONSE",
        itemId1: topCardId,
        itemId2: cardId
      })
      console.log("response from dispatch", response)
      // end turn with discard to center
    }
    if (fromFaceUp && !toCenter) {
      faceUpToHouse({ cardId, destId })
      // end turn by moving to own house
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <RoomDialog />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CenterPile />
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <HouseGrid>
            <div className="bedroom room">
              <Typography className="room-name" variant="caption">
                BEDROOM
              </Typography>
              <DotColumn room={"bedroom"} />
            </div>
            <div className="bath room">
              <Typography className="room-name" variant="caption">
                BATHROOM
              </Typography>
              <DotColumn room={"bath"} />
            </div>
            <div className="garage room">
              <Typography className="room-name" variant="caption">
                GARAGE
              </Typography>
              <DotColumn room={"garage"} />
            </div>
            <div className="kitchen room">
              <Typography className="room-name" variant="caption">
                KITCHEN
              </Typography>
              <DotColumn room={"kitchen"} />
            </div>
          </HouseGrid>
        </Grid>
        <Grid item xs={12} sm={4} md={6}>
          {/* <Button onClick={handleStart}>START</Button> */}
          <FaceUpHousePile />
        </Grid>
      </Grid>
    </DragDropContext>
  )
}

export default House

const StyleColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  align-items: center;
`
const DotColumn = ({ room }) => {
  const { user } = useAuthCtx()
  const { gamePlay } = useGameCtx()
  // const slotArr = state[room]
  const slotArr =
    gamePlay && gamePlay.gameStates && gamePlay.gameStates[user.uid].house[room]
  if (!slotArr) return <div>no slotArr</div>
  return (
    <StyleColumn>
      {slotArr.map((slot, index) => (
        <DropCircle
          key={(room, index)}
          dragId={slot}
          index={index}
          room={room}
        />
      ))}
    </StyleColumn>
  )
}

const CircleTarget = styled.div`
  width: ${boxHeight};
  height: ${boxHeight};
  border: ${p => (p.isDraggingOver ? "white" : "lightgrey")} solid 2px;
  /* border-radius: 50%; */
  z-index: 5;
  background: ${p => (p.isDraggingOver ? "grey" : "none")};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
`
const DropCircle = ({ index, id, dragId, room }) => {
  const dropTarget = (
    <Droppable isDropDisabled={!!dragId} droppableId={`${room}-${index}`}>
      {({ droppableProps, innerRef, placeholder }, { isDraggingOver }) => (
        <div {...droppableProps} ref={innerRef}>
          <CircleTarget isDraggingOver={isDraggingOver}>
            {!!dragId && (
              <DraggableCard
                index={index}
                dragId={dragId}
                flipped
                height={boxHeight}
              />
            )}
            {placeholder}
          </CircleTarget>
        </div>
      )}
    </Droppable>
  )
  return dropTarget
}

const DealMeIn = () => {
  const { dealMeIn } = useGameCtx()
  return (
    <div>
      deal me in:
      <Button onClick={dealMeIn} variant="contained" color="primary">
        GO
      </Button>
    </div>
  )
}
