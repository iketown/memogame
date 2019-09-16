import React, { memo } from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import { images } from "../../../images/newRooms"
import { getBoxSize } from "../../../utils/sizeUtils"
import RoomDrop from "./RoomDrop"
import { useWindowSize, useWiderThan } from "../../../hooks/useScreenSize"
// import { useClickMoveCtx } from "../../../contexts/ClickMoveCtx"
import { useHouseCtx } from "../../../contexts/GameCtx"
import isEqual from "lodash/isEqual"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx"
//
//

const transformOrigins = {
  bedroom: "top left",
  bathroom: "top right",
  kitchen: "center left",
  dining: "center right",
  garage: "bottom left",
  office: "bottom right"
}

export const Room = styled.div`
  position: relative;
  height: ${p => (p.smallUp ? 8 : getBoxSize(p.height))}rem;
  width: ${p => (p.smallUp ? 8 : getBoxSize(p.height))}rem;
  background-image: url(${p => images[p.room]});
  background-color: lightgrey;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  grid-area: ${p => p.room};
  transform-origin: ${p => transformOrigins[p.room]};
`

const WhiteBox = styled.div`
  width: 5rem;
  height: 1rem;
  background: white;
  border-radius: 5%;
  border: 1px solid grey;
  box-shadow: 3px 3px 4px 0px black;
`
const CenteredTitle = styled(Typography)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`
const WhiteBoxes = styled.div`
  position: absolute;
  top: 0;
  bottom: 1rem;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 5px;
`

const RoomDnDContainer = ({ title, handleSelectRoom }) => {
  const { heightText } = useWindowSize()
  const smallUp = useWiderThan("sm")
  const { myHouse } = useHouseCtx()
  const thisRoom = myHouse[title] || []
  return (
    <RoomDnD
      title={title}
      handleSelectRoom={handleSelectRoom}
      heightText={heightText}
      smallUp={smallUp}
      thisRoom={thisRoom}
    />
  )
}

const RoomDnD = memo(
  ({ title, handleSelectRoom, heightText, smallUp, thisRoom }) => {
    console.log("rendering RoomDnD", title)
    return (
      <Room
        height={heightText}
        smallUp={smallUp}
        room={title}
        // hoverFX={hoverFX}
        onClick={() => handleSelectRoom(title)}
      >
        <RoomDrop
          roomId={title}
          thisRoom={thisRoom}
          handleSelectRoom={handleSelectRoom}
        >
          <CenteredTitle className={title} variant="subtitle1">
            {title.toUpperCase()}
          </CenteredTitle>
          <WhiteBoxes>
            {Array.from({ length: thisRoom.length }).map((_, index) => {
              return <WhiteBox key={index}></WhiteBox>
            })}
          </WhiteBoxes>
        </RoomDrop>
      </Room>
    )
  },
  propsEqual
)

function propsEqual(prev, next) {
  const _yepEqual = isEqual(prev, next)
  return _yepEqual
}

export default RoomDnDContainer
