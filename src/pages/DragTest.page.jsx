// import React, { useState } from "react"
// import { Grid, Button, Snackbar, SnackbarContent } from "@material-ui/core"
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
// import styled from "styled-components"
// //
// import { useItemCtx } from "../contexts/ItemContext"
// import { useGameCtx, GameCtxProvider } from "../hooks/useGameCtx"
// import { Item } from "../resources/Item"
// import CenterItemPile from "../components/game/CenterItemPile"
// import ShowMe from "../utils/ShowMe"
// import ItemCard from "../components/ItemCard"
// import Room from "../components/game/Room"
// import FaceUpPile from "../components/game/FaceUpPile.jsx"
// import SnackBarHandler from "../components/SnackBarHandler"
// //
// //

// const DragTestContainer = () => {
//   return (
//     <GameCtxProvider>
//       <DragTest />
//     </GameCtxProvider>
//   )
// }
// const GridRoom = ({ roomId, roomName }) => (
//   <Grid item xs={6} style={{ padding: "4px" }}>
//     <Room roomId={roomId} roomName={roomName} />
//   </Grid>
// )
// const DragTest = () => {
//   const { onDragEnd: ctxDragEnd, gameStatus, dispatch } = useGameCtx()
//   const { allItems } = useItemCtx()
//   function onDragEnd(result) {
//     console.log("result", result)
//     ctxDragEnd(result)
//   }
//   function handleStartGame() {
//     dispatch({ type: "START_GAME", allItems: Object.keys(allItems) })
//   }
//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <SnackBarHandler />
//       <Grid container spacing={2}>
//         <Grid item xs={6}>
//           <CenterItemPile />
//         </Grid>
//         <Grid item xs={6}>
//           success message: {gameStatus}
//           <Button onClick={handleStartGame}>Start Game</Button>
//           <Button onClick={() => dispatch({ type: "SHUFFLE_CENTER" })}>
//             Shuffle Center
//           </Button>
//         </Grid>
//         <Grid item container spacing={2} xs={12} justify="center">
//           <Grid item xs={4}>
//             <FaceUpPile />
//           </Grid>
//           <Grid item container justify="center" xs={8}>
//             <Grid item container justify="center" xs={12}>
//               <GridRoom roomId="room1" roomName="attic" />
//             </Grid>
//             <Grid item container justify="center" xs={12}>
//               <GridRoom roomId="room2" roomName="kitchen" />
//               <GridRoom roomId="room4" roomName="bedroom" />
//             </Grid>
//             <Grid item container justify="center" xs={12}>
//               <GridRoom roomId="room6" roomName="cellar" />
//             </Grid>

//             {/* <GridRoom roomId="room3" roomName="dining" />
//             <GridRoom roomId="room5" roomName="bath" /> */}
//           </Grid>
//         </Grid>
//         <Grid item container xs={12} justify="center">
//           <Grid item xs={3} />
//         </Grid>
//         {/* <Droppable droppableId="unplayed">
//           {({ droppableProps, innerRef, placeholder }) => (
//             <Grid
//               item
//               container
//               spacing={2}
//               xs={12}
//               {...droppableProps}
//               innerRef={innerRef}
//             >
//               <UnplayedCards />
//               {placeholder}
//             </Grid>
//           )}
//         </Droppable> */}
//         <Grid item xs={12}>
//           <GameInfoView />
//         </Grid>
//       </Grid>
//     </DragDropContext>
//   )
// }

// export default DragTestContainer

// const UnplayedCards = () => {
//   const { unplayedItems } = useGameCtx()
//   if (!unplayedItems || !Object.keys(unplayedItems).length)
//     return <div>nothin</div>
//   return Object.entries(unplayedItems).map(([itemId, item], index) => {
//     return (
//       <Grid key={itemId} item xs={6} sm={4} md={3}>
//         <ItemCard item={item} index={index} />
//       </Grid>
//     )
//   })
// }

// const GameInfoView = () => {
//   const { unplayedItems, itemStack, state } = useGameCtx()
//   return (
//     <Grid container spacing={6}>
//       <Grid item xs={6}>
//         <ShowMe obj={unplayedItems} name="unplayedItems" noModal />
//       </Grid>
//       <Grid item xs={6}>
//         <ShowMe obj={state} name="state" noModal />
//       </Grid>
//     </Grid>
//   )
// }
