import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { IconButton } from "@material-ui/core"
import { useDrag } from "react-dnd"
import { FaArrowCircleUp, FaArrowCircleDown, FaEye } from "react-icons/fa"
import moment from "moment"
//
import SorterCard from "./SorterCard"
import { ItemTypes } from "../../../dnd/itemTypes"
import { useTimer } from "../../../hooks/useTimer"
import { useGameCtx, useHouseCtx } from "../../../contexts/GameCtx"
import { useGameFxns } from "../../../hooks/useGameFxns"
import { useAuthCtx } from "../../../contexts/AuthCtx"
//
//
const CardAndButtons = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-items: center;
`
const ResortableDnDCard = ({
  faceUp,
  itemId,
  roomId,
  index,
  isFirst,
  isLast,
  disableButtons,
  resetClock
}) => {
  const { reorderRoomFX } = useGameFxns()

  function handleUp() {
    if (isFirst) return null
    reorderRoomFX({ itemId, roomId, sourceIndex: index, destIndex: index - 1 })
    resetClock()
  }
  function handleDown() {
    if (isLast) return null
    reorderRoomFX({ itemId, roomId, sourceIndex: index, destIndex: index + 1 })
    resetClock()
  }
  return (
    <CardAndButtons>
      {disableButtons || isFirst ? (
        <div />
      ) : (
        <IconButton onClick={handleUp}>
          {!isFirst && <FaArrowCircleUp />}
        </IconButton>
      )}
      <DnDCard faceUp={faceUp} itemId={itemId} roomId={roomId} />
      {disableButtons || isLast ? (
        <div />
      ) : (
        <IconButton onClick={handleDown}>
          {!isLast && <FaArrowCircleDown />}
        </IconButton>
      )}
    </CardAndButtons>
  )
}

export default ResortableDnDCard

const DnDCard = ({ faceUp, itemId, roomId }) => {
  // this is a card from the house.   does not end the turn.
  const { gamePlay } = useGameCtx()
  const { houseToCenterFX } = useGameFxns()
  const { user } = useAuthCtx()
  const { myHouseTimer, addToHouseTimer } = useHouseCtx()

  const [peek, setPeek] = useState(faceUp)
  const timerRef = useRef()
  const handlePeek = () => {
    clearInterval(timerRef.current)
    setPeek(true)
    setTimeout(() => setPeek(false), 1500)
    addToHouseTimer(itemId)
  }

  // this shit is a mess 👇  make a timer hook or use the lib.
  const [secondsLeft, setSecondsLeft] = useState(false)
  useEffect(() => {
    if (myHouseTimer[itemId]) {
      timerRef.current = setInterval(() => {
        const _secondsLeft = Math.floor(
          moment(myHouseTimer[itemId]).diff(moment().endOf("second")) / 1000
        )
        setSecondsLeft(_secondsLeft)
      }, 1000)
    }
  }, [itemId, myHouseTimer])
  useEffect(() => {
    if (secondsLeft < 0) {
      setSecondsLeft(false)
      clearInterval(timerRef.current)
    }
  }, [secondsLeft])
  // this shit is a mess 👆

  const isMyTurn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid

  const canPlay = isMyTurn && !faceUp && !myHouseTimer[itemId]
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: ItemTypes.CARD, itemId, fromStorage: false, roomId },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag: canPlay
  })
  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: `rotate(${isDragging ? 10 : 0}deg)`
      }}
      onDoubleClick={() => {
        canPlay
          ? houseToCenterFX({ roomId, itemId })
          : console.log("cant play that now", `${secondsLeft} seconds left`)
      }}
    >
      <SorterCard
        restricted={!!myHouseTimer[itemId]}
        handlePeek={handlePeek}
        peek={peek}
        secondsLeft={secondsLeft}
        faceUp={faceUp || peek}
        key={itemId}
        itemId={itemId}
      >
        {itemId}
      </SorterCard>
      {!faceUp && !peek && (
        <PeekButtonDiv>
          <IconButton onClick={handlePeek} variant="contained" color="primary">
            <FaEye />
          </IconButton>
        </PeekButtonDiv>
      )}
    </div>
  )
}

const PeekButtonDiv = styled.div`
  position: absolute;
  top: 50%;
  left: -39px;
  transform: translateY(-50%);
`
