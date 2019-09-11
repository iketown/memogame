import React, { useState, useEffect } from "react"
import styled from "styled-components"
import update from "immutability-helper"
import { Button } from "@material-ui/core"
import { images } from "../../../images/newRooms"
import { useHouseCtx } from "../../../contexts/GameCtx"
import ResortableDnDCard from "./ResortableDnDCard"
import DraggableCard from "../DraggableCard.jsx"
import { useWiderThan } from "../../../hooks/useScreenSize"
import ReorderCard from "./ReorderCard"
import ReorderPlaceholder from "./ReorderPlaceholder"
import SelectedRoomDrop from "./SelectedRoomDrop"
import ShowMe from "../../../utils/ShowMe"
import { useGameFxns } from "../../../hooks/useGameFxns"
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
//

const SelectedRoom = ({ selectedRoom, handleSelectRoom }) => {
  const { myHouse } = useHouseCtx()
  const { reorderRoomFX } = useGameFxns()
  //   const [thisRoom, setThisRoom] = useState(myHouse[selectedRoom])
  const [thisRoomLocal, setThisRoomLocal] = useState([])
  useEffect(() => {
    if (myHouse[selectedRoom]) {
      setThisRoomLocal(myHouse[selectedRoom])
    }
  }, [myHouse, selectedRoom])
  const thisRoom = myHouse[selectedRoom] || []
  const addCardLocal = ({ itemId, index }) => {
    setThisRoomLocal(old => [
      ...old.slice(0, index),
      itemId,
      ...old.slice(index)
    ])
  }
  const moveCard = (itemId, atIndex) => {
    const { card, index } = findCard(itemId)

    reorderRoomFX({
      itemId,
      roomId: selectedRoom,
      sourceIndex: index,
      destIndex: atIndex
    })
    // setThisRoom(
    //   update(thisRoom, {
    //     $splice: [[index, 1], [atIndex, 0, card]]
    //   })
    // )
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
        <SelectedRoomDrop addCardLocal={addCardLocal} roomId={selectedRoom}>
          <RoomBigTitle>{selectedRoom.toUpperCase()}</RoomBigTitle>
          <SelectedRoomBackground selectedRoom={selectedRoom} />
          <SelectedRoomContent>
            {thisRoom.map((itemId, index) => (
              <ReorderPlaceholder
                key={itemId}
                roomId={selectedRoom}
                index={index}
                thisRoom={thisRoom}
              >
                <ReorderCard
                  roomId={selectedRoom}
                  thisRoom={thisRoom}
                  index={index}
                  moveCard={moveCard}
                  findCard={findCard}
                  itemId={itemId}
                >
                  {/* <DraggableCard
                itemId={itemId}
                index={index}
                source={selectedRoom}
                scale={smallUp ? 1.5 : 1}
            /> */}
                </ReorderCard>
              </ReorderPlaceholder>
            ))}
            {thisRoom.length < 3 && (
              <ReorderPlaceholder
                roomId={selectedRoom}
                thisRoom={thisRoom}
                index={thisRoom.length}
              />
            )}
          </SelectedRoomContent>
        </SelectedRoomDrop>
      </SelectedRoomSection>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => handleSelectRoom(null)}
      >
        cancel
      </Button>
      {/* <ShowMe obj={thisRoomLocal} name="thisRoomLocal" noModal /> */}
    </>
  )
}

export default SelectedRoom
