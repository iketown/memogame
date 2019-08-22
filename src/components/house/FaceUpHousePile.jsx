// import React, { useState } from "react"
// import { Droppable } from "react-beautiful-dnd"
// import styled from "styled-components"
// import { FaPlus, FaMinus } from "react-icons/fa"
// //

// import { useHouseCtx } from "./houseContext"
// import { removeUid } from "../../utils/imageUtils"
// import DraggableCard from "./DraggableCard.jsx"
// import { Typography, IconButton } from "@material-ui/core"
// import { useGameCtx } from "../../contexts/GameCtx"
// import { useAuthCtx } from "../../contexts/AuthCtx"
// import UnderCard from "../game/UnderCard"
// //
// //
// const PileContainer = styled.div`
//   margin-top: 1rem;
// `
// const StylePile = styled.div`
//   /* border: 1px solid black; */
//   position: relative;
//   .drag-dot {
//     display: inline-block;
//   }
// `
// const FaceUpHousePile = () => {
//   // const { state, dispatch } = useHouseCtx()
//   // if (!state || !state.faceUpPile || !state.faceUpPile.length) return null
//   // const cardArr = state.faceUpPile
//   const [cardIndex, setCardIndex] = useState(0)
//   const { gamePlay } = useGameCtx()
//   const { user } = useAuthCtx()
//   if (!gamePlay) return null
//   const faceUpPile =
//     gamePlay.gameStates && gamePlay.gameStates[user.uid].faceUpPile
//   // const cardArr = gamePlay.faceUpPile
//   if (!faceUpPile) return <div>no face up pile</div>

//   return (
//     <>
//       <p>cards in FaceUp: {faceUpPile.length}</p>
//       <PileContainer>
//         <Droppable droppableId="faceUpPile">
//           {({ droppableProps, innerRef, placeholder }) => (
//             <StylePile {...droppableProps} ref={innerRef}>
//               <DraggableCard index={0} dragId={faceUpPile[cardIndex]} />
//               {placeholder}
//               {faceUpPile.slice(1).map((id, index) => (
//                 <UnderCard
//                   itemId={id}
//                   id={id}
//                   key={(id, index)}
//                   index={index + 1}
//                 />
//               ))}
//             </StylePile>
//           )}
//         </Droppable>
//       </PileContainer>
//       {/* <IconButton onClick={() => setCardIndex(old => old + 1)}>
//         <FaPlus />
//       </IconButton>
//       <IconButton onClick={() => setCardIndex(old => (old > 0 ? old - 1 : 0))}>
//         <FaMinus />
//       </IconButton> */}
//     </>
//   )
// }

// export default FaceUpHousePile
