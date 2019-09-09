import React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import { images } from "../../../images/newRooms"
import { getBoxSize } from "../../../utils/sizeUtils"
import { useWindowSize, useWidth } from "../../../hooks/useScreenSize"
import PulsingTarget from "../../PulsingTarget.jsx"
import { useClickMoveCtx } from "../../../contexts/ClickMoveCtx"
//
//
const hoverFX = `
:hover {
    transition: 0.15s;
    transform: scale(1.2);
    box-shadow: 0 0 20px 2px #5f5f5f;
  }
`
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
  height: ${p => getBoxSize(p.height)}rem;
  width: ${p => getBoxSize(p.height)}rem;
  background-image: url(${p => images[p.room]});
  background-color: lightgrey;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  ${p => (p.hoverFX ? hoverFX : "")};
  grid-area: ${p => p.room};
  transform-origin: ${p => transformOrigins[p.room]};
`

const RoomDnD = ({ title, hoverFX, handleSelectRoom }) => {
  const { heightText } = useWindowSize()
  const { draggingItemId } = useClickMoveCtx()
  return (
    <Room
      height={heightText}
      room={title}
      hoverFX={hoverFX}
      onClick={() => handleSelectRoom(title)}
    >
      {draggingItemId && <PulsingTarget />}
      <Typography className={title} variant="subtitle1">
        {title.toUpperCase()}
      </Typography>
    </Room>
  )
}

export default RoomDnD
