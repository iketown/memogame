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
import { useGameFxns } from "../../hooks/useGameFxns"
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
  const { setExpandedRoom } = useHouseGridCtx()
  const { myHouse } = useHouseCtx()
  const { storageToHouseFX } = useGameFxns()
  const cardsThisRoom = myHouse[roomId] || []

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: () => cardsThisRoom.length < maxItemsPerRoom,
    drop: async (item, mon) => {
      console.log(`item dropped in ${roomId}`, item)
      const { itemId } = item
      storageToHouseFX({ itemId, roomId })
      setExpandedRoom({ roomId, faceUp: true })
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
