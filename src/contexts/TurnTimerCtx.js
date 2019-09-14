// import React, { createContext, useContext, useEffect, useState } from "react"
// import { useFirebase } from "./FirebaseCtx"

// const TurnTimerCtx = createContext()

// export const TurnTimerCtxProvider = props => {
//   const { fdb } = useFirebase()
//   const [lastCheckIn, setLastCheckIn] = useState("hey o")
//   const gameId = props.gameId
//   useEffect(() => {
//     const timerRef = fdb.ref(`/currentGames/${gameId}/whosTurnItIs`)
//     timerRef.on("value", snapshot => {
//       const value = snapshot.val()
//       if (value) {
//         setLastCheckIn(value.lastCheckIn)
//       }
//     })
//   }, [fdb, gameId])
//   return (
//     <TurnTimerCtx.Provider
//       value={{
//         lastCheckIn
//       }}
//       {...props}
//     />
//   )
// }

// export const useTurnTimerCtx = () => {
//   const ctx = useContext(TurnTimerCtx)
//   if (!ctx)
//     throw new Error(
//       "useTurnTimerCtx must be a descendant of TurnTimerCtxProvider 😕 "
//     )
//   const { lastCheckIn } = ctx
//   return { lastCheckIn }
// }

// export const useTimerStarter = () => {
//   const ctx = useContext(TurnTimerCtx)
//   if (!ctx)
//     throw new Error(
//       "useTurnTimerCtx must be a descendant of TurnTimerCtxProvider 😕 "
//     )
//   const { handleStart } = ctx
//   return { handleStart }
// }
