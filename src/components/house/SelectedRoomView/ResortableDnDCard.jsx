import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { IconButton } from "@material-ui/core"
import { useDrag } from "react-dnd"
import { FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa"
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
  const { myHouseTimer } = useHouseCtx()
  const [secondsLeft, setSecondsLeft] = useState(false)
  const timerRef = useRef()
  useEffect(() => {
    if (myHouseTimer[itemId]) {
      timerRef.current = setInterval(() => {
        const _secondsLeft = Math.floor(
          moment(myHouseTimer[itemId]).diff(moment().endOf("second")) / 1000
        )
        setSecondsLeft(_secondsLeft)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
      setSecondsLeft(false)
    }
  }, [itemId, myHouseTimer])
  const isMyTurn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid

  const canPlay = isMyTurn && !faceUp && !secondsLeft
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
          : console.log("cant play that now")
      }}
    >
      <SorterCard
        restricted={!!myHouseTimer[itemId]}
        secondsLeft={secondsLeft}
        faceUp={faceUp}
        key={itemId}
        itemId={itemId}
      >
        {itemId}
      </SorterCard>
    </div>
  )
}
