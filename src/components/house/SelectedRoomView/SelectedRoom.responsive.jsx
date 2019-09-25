import React from "react"
import styled from "styled-components"
import { Button } from "@material-ui/core"
import Timer from "react-compound-timer/build"
import moment from "moment"
//
import { images } from "../../../images/newRooms"
import { useHouseCtx } from "../../../contexts/HouseContext"
import ReorderCard from "./ReorderCard"
import ReorderPlaceholder from "./ReorderPlaceholder"
import SelectedRoomDrop from "./SelectedRoomDrop"
import { useGameFxnsLOC } from "../../../hooks/useGameFxnsLOC"
//
const SelectedRoomSection = styled.div`
  position: relative;
  grid-area: 1/1/-1/-1;
  z-index: 4;
`
const SelectedRoomContent = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
`
const SelectedRoomBackground = styled.div`
  background-image: url(${p => images[p.selectedRoom]});
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  /* z-index: 3; */
  :after {
    position: absolute;
    content: "";
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #ffffff80;
    z-index: 3;
  }
`
const RoomBigTitle = styled.div`
  font-size: 4rem;
  position: absolute;
  left: 0;
  top: 10px;
  z-index: 5;
  margin: 0;
  writing-mode: vertical-rl;
  line-height: 3.5rem;
  color: #ffffff;
  text-shadow: 1px 3px 5px #777474;
`
//

const StyledSeconds = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 4rem;
  color: red;
`
//

const SelectedRoom = () => {
  const {
    myHouse,
    resetRoomTimer,
    onTimerEnd,
    selectedRoom,
    setSelectedRoom
  } = useHouseCtx()
  const { reorderRoom } = useGameFxnsLOC()
  //   const [thisRoom, setThisRoom] = useState(myHouse[selectedRoom])
  const { roomId, expiryTime } = selectedRoom
  const thisRoom = myHouse[roomId] || []

  const moveCard = (itemId, atIndex) => {
    const { index } = findCard(itemId)
    resetRoomTimer()
    reorderRoom({
      itemId,
      roomId,
      sourceIndex: index,
      destIndex: atIndex
    })
  }
  const findCard = itemId => {
    const card = thisRoom.filter(c => c === itemId)[0]
    return {
      card,
      index: thisRoom.indexOf(card)
    }
  }
  return (
    <>
      <SelectedRoomSection selectedRoom={selectedRoom}>
        <SelectedRoomDrop roomId={roomId}>
          <RoomBigTitle>{roomId.toUpperCase()}</RoomBigTitle>
          <SelectedRoomBackground selectedRoom={roomId} />
          <SelectedRoomContent>
            {thisRoom.map((itemId, index) => (
              <ReorderPlaceholder
                key={itemId}
                roomId={roomId}
                index={index}
                thisRoom={thisRoom}
              >
                <ReorderCard
                  roomId={roomId}
                  thisRoom={thisRoom}
                  index={index}
                  moveCard={moveCard}
                  findCard={findCard}
                  itemId={itemId}
                ></ReorderCard>
              </ReorderPlaceholder>
            ))}
            {thisRoom.length < 3 && (
              <ReorderPlaceholder
                roomId={roomId}
                thisRoom={thisRoom}
                index={thisRoom.length}
              />
            )}
          </SelectedRoomContent>
        </SelectedRoomDrop>
        {expiryTime && (
          <Timer
            key={expiryTime}
            direction="backward"
            initialTime={moment(expiryTime).diff(moment())}
            checkpoints={[{ time: 0, callback: onTimerEnd }]}
          >
            <StyledSeconds>{/* <Timer.Seconds /> */}</StyledSeconds>
          </Timer>
        )}
      </SelectedRoomSection>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => setSelectedRoom({ roomId: "", faceUp: false })}
      >
        CLOSE
      </Button>
    </>
  )
}

export default SelectedRoom
