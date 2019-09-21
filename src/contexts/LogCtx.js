import React, { createContext, useContext, useState, useEffect } from "react"
import { useFirebase } from "./FirebaseCtx"
import { useAuthCtx } from "./AuthCtx"
import { useGameCtx } from "./GameCtx"
import { doItemsMatch } from "../utils/gameLogic"
import { itemFromItemId } from "../resources/allItems"
import { usePlayersCtx } from "./PlayersCtx"
const LogCtx = createContext()


export const useLogCtx = byWho => {
  const { doAddToLog } = useFirebase()
  const { user } = useAuthCtx()
  const { players } = usePlayersCtx()
  // const {
  //   gameState: { gameId }
  // } = useGameCtx("useLogCtx")
  const gameId = 123

  const addLogMessage = ({ itemId, destination }) => {
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
