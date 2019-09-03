// import React, { useEffect, useState } from "react"
// import styled from "styled-components"
// import moment from "moment"
// import { Button } from "@material-ui/core"
// import useCountDown from "react-countdown-hook"
// import { useFirebase } from "../../contexts/FirebaseCtx"
// import { useTurnTimerCtx } from "../../contexts/TurnTimerCtx"
// import { useGameFxns } from "../../hooks/useGameFxns"
// import { useTurnTimer } from "../../hooks/useTurnTimer"
// //
// //
// const HourGlass = styled.div`
//   height: 100%;
//   width: 3rem;
//   border: 1px solid grey;
//   position: relative;
//   font-weight: bold;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `
// const MyTurnTimer = ({ initialTime = 15 * 1000 }) => {
//   const { lastCheckIn } = useTurnTimerCtx()

//   return (
//     <HourGlass>
//       <CountDown lastCheckIn={lastCheckIn} />
//     </HourGlass>
//   )
// }

// export default MyTurnTimer

// const Sand = styled.div`
//   position: absolute;
//   transition: 0.5s top;
//   top: ${p => 100 - p.ratio * 100}%;
//   bottom: 0;
//   width: 100%;
//   background: rgb(190, 150, 150);
// `
// const SecondsDisplay = styled.div`
//   position: absolute;
//   top: 50%;
//   z-index: 2;
//   transform: translateY(-50%);
//   font-size: 1.5rem;
// `
// const CountDown = ({ lastCheckIn, secondsPerTurn = 25 }) => {
//   const { secondsLeft } = useTurnTimer({ secondsPerTurn: 24 })
//   return (
//     <>
//       <Sand secondsLeft={secondsLeft} ratio={secondsLeft / secondsPerTurn} />
//       <SecondsDisplay>{secondsLeft}</SecondsDisplay>
//     </>
//   )
// }
