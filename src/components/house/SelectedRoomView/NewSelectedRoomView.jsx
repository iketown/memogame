import React, { useEffect, useCallback, useRef } from "react"
import styled from "styled-components"
import {
  CardContent,
  Card,
  CardActions,
  Button,
  Typography
} from "@material-ui/core"
import { useDrop } from "react-dnd"
import Timer from "react-compound-timer"
//
import { ItemTypes } from "../../../dnd/itemTypes"
import ResortableDnDCard from "./ResortableDnDCard.jsx"
import kitchen from "../../../images/rooms/kitchen.jpg"
import garage from "../../../images/rooms/garage.jpg"
import bathroom from "../../../images/rooms/bathroom.jpg"
import bedroom from "../../../images/rooms/bedroom.jpg"
import cellar from "../../../images/rooms/cellar.jpg"
import attic from "../../../images/rooms/attic.jpg"
import family from "../../../images/rooms/family.jpg"
import { useHouseGridCtx } from "../../../contexts/HouseGridCtx"
import { useHouseCtx } from "../../../contexts/GameCtx"
import { useGameFxns } from "../../../hooks/useGameFxns"
import EmptyRoomButton from "../EmptyRoomButton"
import { maxItemsPerRoom } from "../../../utils/gameLogic"
//

const roomImages = {
  kitchen,
  garage,
  bathroom,
  bedroom,
  cellar,
  attic,
  family
}

const StyledSelectedRoom = styled.div`
  grid-area: 1 / 1 / -1 / -1;
  position: relative;
  z-index: 20;
  height: 100%;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  .card {
    height: 105%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${p => (p.isOver ? "red" : "#ffffffcc")};
    .content {
      flex-grow: 1;
    }
  }
  .card::before {
    /* card background image */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${p => roomImages[p.room]});
    background-size: cover;
    background-position: center;
    content: "";
    z-index: -1;
    filter: blur(1px);
  }
  .transparent {
    background: none;
  }
`

const TimerContainer = () => {
  const { expandedRoom, setExpandedRoom } = useHouseGridCtx()
  const handleCloseRoom = () => {
    setExpandedRoom({ open: false, roomId: "" })
  }
  const handleAutoCloseRoom = () => {
    if (expandedRoom.faceUp) {
      setExpandedRoom({ open: false, roomId: "" })
    } else {
      // only close room when cards are faceUp.
    }
  }
  if (!expandedRoom || !expandedRoom.roomId) return null
  return (
    // <ClickOutsider close={handleCloseRoom}>
    <Timer
      initialTime={10.5 * 1000}
      direction="backward"
      checkpoints={[{ time: 0, callback: handleAutoCloseRoom }]}
    >
      {({ resume, start, reset, getTime, stop }) => {
        const resetClock = () => {
          console.log("resetting")
          reset()
          start()
        }
        return (
          <SelectedRoomView
            handleCloseRoom={handleCloseRoom}
            resetClock={resetClock}
          />
        )
      }}
    </Timer>
    // </ClickOutsider>
  )
}

const SelectedRoomView = ({ handleCloseRoom, resetClock }) => {
  const { myHouse } = useHouseCtx()

  const { expandedRoom, setExpandedRoom } = useHouseGridCtx()

  const { storageToHouseFX } = useGameFxns()
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    canDrop: ({ itemId, type }) => {
      const cardsThisRoom = (expandedRoom && myHouse[expandedRoom.roomId]) || []
      if (cardsThisRoom.includes(itemId)) return false
      if (cardsThisRoom.length >= maxItemsPerRoom) return false
      return true
    },
    drop: async (item, mon) => {
      console.log(`item dropped in ${roomId}`, item)
      const { itemId, fromStorage } = item
      if (fromStorage) {
        storageToHouseFX({ itemId, roomId })
        resetClock()
        // if dropped on facedown, make it faceup
        setExpandedRoom({ open: true, roomId, faceUp: true })
        // reset timer
      }
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop()
    })
  })
  // useEffect(() => {
  //   resetClock()
  // }, [expandedRoom, resetClock])
  // if (!expandedRoom || !expandedRoom.roomId) return null
  const { roomId, faceUp } = expandedRoom
  const thisRoom = myHouse[roomId] || []

  return (
    <>
      <SelectedRoomCard
        handleCloseRoom={handleCloseRoom}
        isOver={isOver && canDrop}
        dropRef={dropRef}
        {...{
          roomId,
          thisRoom,
          faceUp,
          setExpandedRoom,
          resetClock
        }}
      />
    </>
  )
}

const SelectedRoomCard = ({
  roomId,
  thisRoom,
  faceUp,
  resetClock,
  dropRef,
  isOver,
  handleCloseRoom
}) => {
  const cardContents = (
    <>
      <Typography variant="h5">{roomId.toUpperCase()}</Typography>
      <CardContent className="content">
        {thisRoom.map((itemId, index) => {
          const isFirst = index === 0
          const isLast = index === thisRoom.length - 1
          return (
            <ResortableDnDCard
              isFirst={isFirst}
              isLast={isLast}
              key={itemId}
              index={index}
              faceUp={faceUp}
              itemId={itemId}
              roomId={roomId}
              disableButtons={!faceUp}
              resetClock={resetClock}
            />
          )
        })}
      </CardContent>
      <CardActions>
        {/* <ShowMe obj={myHouseTimer} name="myHouseTimer" /> */}
        <Button variant="contained" color="primary" onClick={handleCloseRoom}>
          <span style={{ marginRight: "5px" }}>close</span>
          {faceUp && (
            <span>
              <Timer.Seconds />
            </span>
          )}
        </Button>
        <EmptyRoomButton roomId={roomId} handleCloseRoom={handleCloseRoom} />
      </CardActions>
    </>
  )
  return (
    <StyledSelectedRoom isOver={isOver} ref={dropRef} room={roomId}>
      <Card className="card">{cardContents}</Card>
    </StyledSelectedRoom>
  )
}

export default TimerContainer
