import React, { useReducer } from "react"
import styled from "styled-components"
import { Container, Grid, Avatar, Button, Typography } from "@material-ui/core"
import { FaCircle } from "react-icons/fa"
import imgs from "../../images/index"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { HouseCtxProvider, useHouseCtx } from "./houseContext"
import FaceUpHousePile from "./FaceUpHousePile"
import RoomDialog from "./RoomDialog"
import { useItemCtx } from "../../contexts/ItemContext"
import DraggableCard from "./DraggableCard.jsx"
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
  .room:hover:after {
    opacity: 0.9;
    filter: blur(0);
  }
`
const Floor = styled.div`
  display: grid;
  grid-template-rows: 26rem;
`
// const TopFloor = styled(Floor)`
//   grid-template-columns: 2fr 1fr;

// `
// const BottomFloor = styled(Floor)`
//   grid-template-columns: 1fr 1fr;

// `

//
//

const House = () => {
  return (
    <HouseCtxProvider>
      <HouseContents />
    </HouseCtxProvider>
  )
}

const HouseContents = () => {
  const { state, dispatch } = useHouseCtx()
  const { allItems } = useItemCtx()
  console.log("allItems", allItems)
  const onDragEnd = result => {
    console.log("result", result)
    if (!result.destination) return null
    if (result.destination.droppableId === "dialog") {
      dispatch({ type: "REORDER-ROOM", result })
      return null
    }
    dispatch({ result, type: "MOVE-DOT" })
  }
  const handleStart = () => {
    dispatch({ type: "START_GAME", items: allItems })
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <RoomDialog />
      <Grid container spacing={2}>
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
              <DotColumn room={"bathroom"} />
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
          <Button onClick={handleStart}>START</Button>
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
  const { state } = useHouseCtx()
  const slotArr = state[room]
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
      {({ droppableProps, innerRef }, { isDraggingOver }) => (
        <div {...droppableProps} ref={innerRef}>
          <CircleTarget isDraggingOver={isDraggingOver}>
            {!!dragId && (
              <DraggableCard index={index} dragId={dragId} flipped />
            )}
          </CircleTarget>
        </div>
      )}
    </Droppable>
  )
  return dropTarget
}

// export const StyledCard = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: ${p => p.height || boxHeight};
//   width: ${p => p.height || boxHeight};
//   background-color: white;
//   background-image: url(${p => p.cardImage});
//   background-size: contain;
//   border: 2px solid black;
//   /* border-radius: 50%; */
//   font-weight: bold;
//   font-size: 2rem;
// `

// export const DraggableCard = ({ index, dragId, flipped }) => {
//   const { imagesObj } = useItemCtx()

//   const dragChip = (
//     <Draggable draggableId={dragId} index={index}>
//       {({ dragHandleProps, draggableProps, innerRef }) => (
//         <div
//           {...dragHandleProps}
//           {...draggableProps}
//           ref={innerRef}
//           index={index}
//           className="drag-dot"
//         >
//           <StyledCard
//             cardImage={flipped ? brain : imagesObj[dragId]}
//             height="5rem"
//           />
//         </div>
//       )}
//     </Draggable>
//   )
//   return dragChip
// }