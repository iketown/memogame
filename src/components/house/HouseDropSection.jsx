import React from "react"
import { useDrop } from "react-dnd"
import styled from "styled-components"
//
import { ItemTypes } from "../../dnd/itemTypes"
import HouseWindow from "./HouseWindow.jsx"
import { useHouseGridCtx } from "../../contexts/HouseGridCtx"
import { maxItemsPerRoom } from "../../utils/gameLogic"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { useLogCtx } from "../../contexts/LogCtx"
import {
  useGameCtx,
  useHouseCtx,
  useStoragePileCtx
} from "../../contexts/GameCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import { useGamePlayCtx } from "../../contexts/GamePlayCtx"
//
//

const StyledSection = styled.div`
  position: relative;
`
const ColoredOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  background-color: ${p => p.color || "yellow"};
  transition: opacity 0.2s;
  opacity: ${p => (p.show ? 0.3 : 0)};
`
const HouseDropSection = ({ roomId, display }) => {
  const { houseState, houseDispatch, setExpandedRoom } = useHouseGridCtx()
  const { myHouse, addToRoomLocal } = useHouseCtx()
  const { removeFromStorageLocal } = useStoragePileCtx()
  const { gamePlay, gameState } = useGameCtx()
  const { addLogMessage } = useLogCtx()
  const { user } = useAuthCtx()
  const gameId = gameState && gameState.gameId
  const { storageToHouse, playStorageToHouse } = useFirebase()
  const cardsThisRoom = myHouse[roomId] || []

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: () => cardsThisRoom.length < maxItemsPerRoom,
    drop: async (item, mon) => {
      console.log(`item dropped in ${roomId}`, item)
      const { fromStorage, itemId } = item
      if (fromStorage) {
        // they're all from storage right now ?
        removeFromStorageLocal(itemId)
        addToRoomLocal({ itemId, roomId })
        setExpandedRoom({ roomId, faceUp: true })
        const response = await playStorageToHouse({
          itemId,
          gameId,
          roomId
        }).catch(err => console.log("error from storageToHouse", err))
        console.log("response from storageToHouse", response)
        addLogMessage({ itemId, destination: "house" })
      }
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop()
    })
  })
  return (
    <StyledSection ref={dropRef} key={roomId} className={`window ${roomId}`}>
      <ColoredOverlay color="green" show={canDrop && isOver} />
      <HouseWindow
        cardsThisRoom={cardsThisRoom}
        indicateNoDrop={isOver && !canDrop}
        enlarge={isOver && canDrop}
        roomId={roomId}
        display={display}
      />
    </StyledSection>
  )
}

export default HouseDropSection
