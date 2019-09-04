// import React, { useEffect } from "react"
// import styled from "styled-components"
// import {
//   CardContent,
//   Card,
//   CardActions,
//   Button,
//   Typography
// } from "@material-ui/core"
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
// import { useDrag } from "react-dnd"
// import useCountDown from "react-countdown-hook"

// //
// import kitchen from "../../images/rooms/kitchen.jpg"
// import garage from "../../images/rooms/garage.jpg"
// import bathroom from "../../images/rooms/bathroom.jpg"
// import bedroom from "../../images/rooms/bedroom.jpg"
// import cellar from "../../images/rooms/cellar.jpg"
// import attic from "../../images/rooms/attic.jpg"
// import family from "../../images/rooms/family.jpg"
// import brain from "../../images/newCards/brain.svg"
// import { ItemTypes } from "../../dnd/itemTypes"
// import { useHouseGridCtx } from "../../contexts/HouseGridCtx"
// import { useWiderThan } from "../../hooks/useWidth"
// import { useGameCtx, useHouseCtx } from "../../contexts/GameCtx"
// import { useAuthCtx } from "../../contexts/AuthCtx"
// import { removeUid } from "../../utils/imageUtils"
// import { useGameFxns } from "../../hooks/useGameFxns"
// import { useAllItemsCtx } from "../../contexts/AllItemsCtx"
// import AutoCloseButton from "../AutoCloseButton"
// import EmptyRoomButton from "./EmptyRoomButton"
// //

// const roomImages = {
//   kitchen,
//   garage,
//   bathroom,
//   bedroom,
//   cellar,
//   attic,
//   family
// }

// const StyledSelectedRoom = styled.div`
//   grid-area: 1 / 1 / -1 / -1;
//   position: relative;
//   z-index: 20;
//   height: 100%;
//   width: 90%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   .card {
//     height: 105%;
//     width: 100%;
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     background-color: #ffffffcc;
//     .content {
//       flex-grow: 1;
//     }
//   }
//   .card::before {
//     /* card background image */
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background-image: url(${p => roomImages[p.room]});
//     background-size: cover;
//     background-position: center;
//     content: "";
//     z-index: -1;
//     filter: blur(1px);
//   }
//   .transparent {
//     background: none;
//   }
// `

// const MakeDroppable = ({ droppableId, children }) => {
//   return (
//     <Droppable droppableId={droppableId}>
//       {({ droppableProps, innerRef, placeholder }) => (
//         <div {...droppableProps} ref={innerRef} className="card">
//           {children}
//           {placeholder}
//         </div>
//       )}
//     </Droppable>
//   )
// }

// const MakeDraggable = ({ draggableId, index, children }) => {
//   return (
//     <Draggable draggableId={draggableId} index={index}>
//       {({ dragHandleProps, draggableProps, innerRef }) => (
//         <div ref={innerRef} {...dragHandleProps} {...draggableProps}>
//           {children}
//         </div>
//       )}
//     </Draggable>
//   )
// }
// const initialTime = 6 * 1000
// const SelectedRoomView = () => {
//   const { expandedRoom, setExpandedRoom } = useHouseGridCtx()
//   const { myHouse } = useHouseCtx()
//   const { reorderRoomFX } = useGameFxns()
//   const [timeLeft, start] = useCountDown(initialTime, 1000)
//   // start the timer when the expanded room opens
//   useEffect(() => {
//     if (expandedRoom && expandedRoom.faceUp) {
//       start()
//     }
//   }, [expandedRoom, start])
//   // close the window when the timer gets to zero
//   useEffect(() => {
//     if (timeLeft === 0) {
//       setExpandedRoom({ open: false, roomId: "" })
//     }
//   }, [setExpandedRoom, timeLeft])

//   if (!expandedRoom || !expandedRoom.roomId) return null
//   const { roomId, faceUp } = expandedRoom
//   const thisRoom = myHouse[roomId] || []

//   async function onDragEnd(result) {
//     start()
//     const { source, destination, draggableId: itemId } = result
//     if (!destination) return null
//     const { index: sourceIndex } = source
//     const { index: destIndex } = destination
//     if (sourceIndex === destIndex) return null
//     reorderRoomFX({ itemId, roomId, sourceIndex, destIndex })
//   }
//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <SelectedRoomCard
//         {...{ roomId, thisRoom, faceUp, setExpandedRoom, timeLeft, start }}
//         enableBeautifulDragDrop={!!faceUp}
//       />
//     </DragDropContext>
//   )
// }

// const SelectedRoomCard = ({
//   roomId,
//   thisRoom,
//   faceUp,
//   setExpandedRoom,
//   enableBeautifulDragDrop,
//   timeLeft,
//   start
// }) => {
//   function handleCloseRoom() {
//     setExpandedRoom({ open: false, roomId: "" })
//   }
//   const cardContents = (
//     <>
//       <Typography variant="h5">{roomId.toUpperCase()}</Typography>
//       <CardContent className="content">
//         {thisRoom.map((itemId, index) => {
//           if (enableBeautifulDragDrop)
//             return (
//               <MakeDraggable key={itemId} draggableId={itemId} index={index}>
//                 <SorterCard faceUp={faceUp} key={itemId} itemId={itemId}>
//                   {itemId}
//                 </SorterCard>
//               </MakeDraggable>
//             )
//           return (
//             <DnDCard
//               key={itemId}
//               faceUp={faceUp}
//               itemId={itemId}
//               roomId={roomId}
//             />
//           )
//         })}
//       </CardContent>
//       <CardActions>
//         {enableBeautifulDragDrop ? (
//           <AutoCloseButton
//             start={start}
//             timeLeft={timeLeft}
//             handleCloseRoom={handleCloseRoom}
//           />
//         ) : (
//           <Button variant="contained" color="primary" onClick={handleCloseRoom}>
//             close
//           </Button>
//         )}
//         <EmptyRoomButton roomId={roomId} handleCloseRoom={handleCloseRoom} />
//       </CardActions>
//     </>
//   )
//   return (
//     <StyledSelectedRoom room={roomId}>
//       {enableBeautifulDragDrop ? (
//         <MakeDroppable droppableId={roomId}>
//           <Card className="card transparent">{cardContents}</Card>
//         </MakeDroppable>
//       ) : (
//         <Card className="card">{cardContents}</Card>
//       )}
//     </StyledSelectedRoom>
//   )
// }

// export default SelectedRoomView

// const StyledSorterCard = styled(Card)`
//   width: ${p => p.width}rem;
//   height: ${p => p.width}rem;
//   background-image: url(${p => p.image});
//   background-size: cover;
//   border: 5px solid white;
//   padding: 5px;
//   margin: 8px;
// `
// const SorterCard = ({ itemId, faceUp }) => {
//   const { allItems } = useAllItemsCtx()
//   const image = faceUp ? allItems[removeUid(itemId)].card : brain
//   const mdUp = useWiderThan("md")
//   return <StyledSorterCard width={mdUp ? 6.5 : 4.5} image={image} />
// }

// const DnDCard = ({ faceUp, itemId, roomId }) => {
//   // this is a card from the house.   does not end the turn.
//   const { gamePlay } = useGameCtx()
//   const { houseToCenterFX } = useGameFxns()
//   const { user } = useAuthCtx()
//   const isMyTurn =
//     gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid

//   const [{ isDragging }, dragRef] = useDrag({
//     item: { type: ItemTypes.CARD, itemId, fromStorage: false, roomId },
//     collect: monitor => ({
//       isDragging: !!monitor.isDragging()
//     }),
//     canDrag: isMyTurn
//   })
//   return (
//     <div
//       ref={dragRef}
//       style={{
//         opacity: isDragging ? 0.5 : 1,
//         transform: `rotate(${isDragging ? 10 : 0}deg)`
//       }}
//       onDoubleClick={() => {
//         isMyTurn
//           ? houseToCenterFX({ roomId, itemId })
//           : console.log("not your turn")
//       }}
//     >
//       <SorterCard faceUp={faceUp} key={itemId} itemId={itemId}>
//         {itemId}
//       </SorterCard>
//     </div>
//   )
// }
