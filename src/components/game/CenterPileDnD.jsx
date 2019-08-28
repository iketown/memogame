import React, { useState } from "react"
import { useDrop } from "react-dnd"
import styled from "styled-components"
import felt from "../../images/felt.jpg"
//
import { ItemTypes } from "../../dnd/itemTypes"
import { useWiderThan } from "../../hooks/useWidth"
import {
  useGameCtx,
  useCenterPileCtx,
  useStoragePileCtx,
  useHouseCtx
} from "../../contexts/GameCtx"
import { Typography } from "@material-ui/core"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { WindowCard } from "../house/DraggableCard"
import { useHouseGridCtx } from "../../contexts/HouseGridCtx"
import { useLogCtx } from "../../contexts/LogCtx"
import DropCardSound from "../../sounds/DropCard.sound"
import { useGameFxns } from "../../hooks/useGameFxns"
//
//

const StyleTable = styled.div`
  position: relative;
  width: ${p => p.width}rem;
  height: ${p => p.width}rem;
  border-bottom: 6px solid #003c00;
  border-radius: 50%;
  background-size: cover;
  background-color: ${p => (p.isOver ? "green" : "lightgreen")};
  background-image: url(${felt});
  transform: scaleY(0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`
const offset = 0
const TableHalo = styled.div`
  /* transform: scaleY(0.9); */
  position: absolute;
  top: -${offset}px;
  bottom: -${offset}px;
  left: -${offset}px;
  right: -${offset}px;
  border: 1px solid lightgreen;
  border-radius: 50%;
  box-shadow: 1px 0px 20px 7px #2fdc36;
`
const CenterPileDnD = () => {
  const mdUp = useWiderThan("md")
  const { storageToCenter, houseToCenter, playStorageToCenter } = useFirebase()
  const { addLogMessage } = useLogCtx()
  const { removeFromStorageLocal } = useStoragePileCtx()
  const { centerPile, addToCenterLocal } = useCenterPileCtx()
  const { removeFromRoomFS } = useHouseCtx()
  const { removeFromRoomFX, storageToCenterFX, houseToCenterFX } = useGameFxns()
  const { setExpandedRoom } = useHouseGridCtx()
  const {
    gamePlay,
    gameState: { gameId }
  } = useGameCtx()
  const [playDropCardSound, setPlayDropCardSound] = useState(false)
  const rightAnswerSound = () => {
    setPlayDropCardSound("right")
  }
  const wrongAnswerSound = () => {
    setPlayDropCardSound("wrong")
  }
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: () => true,
    drop: (item, monitor) => {
      console.log("item dropped in center", item)
      const { fromStorage, itemId, roomId } = item
      if (fromStorage) {
        storageToCenterFX({ itemId })
      } else {
        setPlayDropCardSound(true)
        houseToCenterFX({ roomId, itemId })
        setExpandedRoom({ roomId: false })
      }
      addLogMessage({ itemId, destination: "center" })
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop()
    })
  })
  return (
    <StyleTable isOver={isOver} width={mdUp ? 11 : 9} ref={dropRef}>
      <DropCardSound
        playDropCardSound={playDropCardSound}
        setPlayDropCardSound={setPlayDropCardSound}
      />
      <Typography variant="h5">CENTER</Typography>
      {centerPile.map((itemId, index) => (
        <WindowCard
          scale={1.5}
          index={index + 2}
          key={itemId}
          itemId={itemId}
        />
      ))}
      {isOver && <TableHalo />}
      <QuantityCircle background="#024e02" quantity={centerPile.length} />
    </StyleTable>
  )
}

export default CenterPileDnD

const StyleQuantityCircle = styled.div`
  position: absolute;
  bottom: 0;
  right: -2rem;
  font-size: 2rem;
  font-weight: bold;
  background: ${p => p.background || "black"};
  color: white;
  border-radius: 50%;
  padding: 4px;
  width: 45px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  box-shadow: 0px 3px 2px #00000040;
  border: 1px solid black;
`
export const QuantityCircle = ({ quantity = 0, background }) => {
  return (
    <StyleQuantityCircle background={background}>
      {quantity}
    </StyleQuantityCircle>
  )
}
