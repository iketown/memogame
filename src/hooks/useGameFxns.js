import React from "react"
import { useFirebase } from "../contexts/FirebaseCtx"
import { useGameCtx } from "../contexts/GameCtx"
import { useAuthCtx } from "../contexts/AuthCtx"
import { doItemsMatch, shuffle } from "../utils/gameLogic"
import { useLogCtx } from "../contexts/LogCtx"
export const useGameFxns = () => {
  const { gameId, gamePlay } = useGameCtx()
  const { user } = useAuthCtx()
  const { fdb } = useFirebase()
  const { addLogMessage } = useLogCtx()
  // internal fxns
  async function _myHouseRefAndValue() {
    const myHouseRef = fdb.ref(
      `/currentGames/${gameId}/gameStates/${user.uid}/house`
    )
    const myHouseValue = await myHouseRef.once("value").then(snapshot => {
      return snapshot.val() || {}
    })
    return { myHouseRef, myHouseValue }
  }
  async function _centerRefAndValue() {
    const centerRef = fdb.ref(`/currentGames/${gameId}/centerCardPile`)
    const centerValue = await centerRef.once("value").then(snapshot => {
      return snapshot.val() || []
    })
    return { centerRef, centerValue }
  }
  async function _storageRefAndValue() {
    const storageRef = fdb.ref(
      `/currentGames/${gameId}/gameStates/${user.uid}/storagePile`
    )
    const storageValue = await storageRef.once("value").then(snapshot => {
      return snapshot.val() || []
    })
    return { storageRef, storageValue }
  }
  function _endTurn() {
    const { members } = gamePlay
    const myIndex = members.findIndex(mem => mem.uid === user.uid)
    if (myIndex < 0) throw new Error(`my index is ${myIndex}??`)
    const nextIndex = (myIndex + 1) % members.length
    const nextPerson = members[nextIndex]
    fdb.ref(`/currentGames/${gameId}/whosTurnItIs`).set(nextPerson)
  }
  async function addPileToStorage(pile) {
    const { storageRef, storageValue } = await _storageRefAndValue()
    shuffle(pile)
    const newStorageValue = [...storageValue, ...pile]
    storageRef.set(newStorageValue)
  }
  async function removeFromRoomFX({ roomId, itemId }) {
    if (!roomId || !itemId)
      throw new Error(`missing roomId:${roomId} or itemId:${itemId}`)
    const { myHouseRef, myHouseValue } = await _myHouseRefAndValue()
    console.log("myHouseValue", myHouseValue)
    const newRoom = myHouseValue[roomId].filter(_itemId => _itemId !== itemId)
    myHouseValue[roomId] = newRoom
    console.log("myHouseValue", myHouseValue)
    return myHouseRef.set(myHouseValue)
  }
  async function addToCenterFX({ itemId }) {
    const { centerRef, centerValue } = await _centerRefAndValue()
    // validate here
    const [topCard, ...underCards] = centerValue
    const isValid = doItemsMatch(topCard, itemId)
    console.log("isValid?", isValid)
    if (isValid) {
      // UI respond to valid card
      const newCenter = [itemId, ...centerValue]
      return centerRef.set(newCenter)
    } else {
      // UI respond to inValid card
      await addPileToStorage(underCards)
      const newCenter = [itemId]
      return centerRef.set(newCenter)
    }
  }
  async function addToRoomFX({ roomId, itemId }) {
    const { myHouseRef, myHouseValue } = await _myHouseRefAndValue()
    const newHouse = { ...myHouseValue }
    newHouse[roomId] = newHouse[roomId]
      ? [...newHouse[roomId], itemId] // add it to the bottom
      : [itemId]
    return myHouseRef.set(newHouse)
  }
  async function removeFromStorageFX({ itemId }) {
    const { storageRef, storageValue } = await _storageRefAndValue()
    console.log("storageValue", storageValue)
    const newStorageVal = storageValue.filter(_itemId => _itemId !== itemId)
    storageRef.set(newStorageVal)
    _endTurn()
  }
  function storageToCenterFX({ itemId }) {
    removeFromStorageFX({ itemId })
    addToCenterFX({ itemId })
  }
  function houseToCenterFX({ roomId, itemId }) {
    removeFromRoomFX({ roomId, itemId })
    addToCenterFX({ itemId })
  }
  function storageToHouseFX({ roomId, itemId }) {
    removeFromStorageFX({ itemId })
    addToRoomFX({ roomId, itemId })
    addLogMessage({ itemId, destination: "house" })
  }
  async function reorderRoomFX({ itemId, roomId, sourceIndex, destIndex }) {
    console.log("reorder room", { itemId, roomId, sourceIndex, destIndex })
    const { myHouseRef, myHouseValue } = await _myHouseRefAndValue()
    const newRoom = myHouseValue[roomId]
    const [movingId] = newRoom.splice(sourceIndex, 1)
    if (movingId !== itemId)
      throw new Error(`these should match ${movingId} / ${itemId}`)
    newRoom.splice(destIndex, 0, movingId)
    myHouseRef.update({ [roomId]: newRoom })
  }
  async function moveCenterToStorageFX() {
    // after putting down a wrong card
  }
  return {
    storageToCenterFX,
    houseToCenterFX,
    removeFromRoomFX,
    storageToHouseFX,
    addToRoomFX,
    addToCenterFX,
    removeFromStorageFX,
    reorderRoomFX
  }
}
