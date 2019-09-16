import React, { createContext, useContext, useState, useEffect } from "react"
import { useFirebase } from "./FirebaseCtx"
import { useAuthCtx } from "./AuthCtx"
import { useGameCtx } from "./GameCtx"
import { doItemsMatch } from "../utils/gameLogic"
import { itemFromItemId } from "../resources/allItems"
import { usePlayersCtx } from "./PlayersCtx"
const LogCtx = createContext()

// export const LogCtxProvider = props => {
//   const { fdb, doAddToLog } = useFirebase()
//   const gameId = props.gameId
//   const [log, setLog] = useState({})
//   useEffect(() => {
//     const gameLogRef = fdb.ref(`/currentGames/${gameId}/gameLog`)
//     gameLogRef.on("value", snapshot => {
//       const newJson = JSON.stringify(snapshot.val() || {})
//       const oldJson = JSON.stringify(log)
//       if (newJson !== oldJson) {
//         console.log("setting log")
//         setLog(snapshot.val() || {})
//       }
//     })
//     return gameLogRef.off
//   }, [fdb, gameId, log])
//   return (
//     <LogCtx.Provider value={{ log,  gameId, doAddToLog }} {...props} />
//   )
// }

export const useLogCtx = byWho => {
  console.log("useLogCtx called", byWho)
  const { doAddToLog } = useFirebase()
  const { user } = useAuthCtx()
  const { players } = usePlayersCtx()
  // const {
  //   gameState: { gameId }
  // } = useGameCtx("useLogCtx")
  const gameId = 123

  const addLogMessage = ({ itemId, destination }) => {
    console.log("addLogMessage called")
    // Frank puts Purple Eggplant on center
    // Henry moves card into house
    const myPP = players[user.uid]
    const name = myPP.displayName || myPP.email
    const itemName = itemFromItemId(itemId).name
    let text
    if (destination === "house") {
      text = `${name} puts ${itemName} in house`
    }
    if (destination === "center") {
      text = `${name} plays ${itemName}`
    }

    doAddToLog({
      gameId,
      uid: user.uid,
      player: players[user.uid],
      text
    })
  }
  return { addLogMessage }
}
