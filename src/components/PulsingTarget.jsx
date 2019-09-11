import React from "react"
import styled from "styled-components"
import { FaBullseye, FaArrowDown } from "react-icons/fa"
// import { useClickMoveCtx } from "../contexts/ClickMoveCtx"

const TargetBox = styled.div`
  font-size: 2rem;
  z-index: 7;
  /* background-color: yellow; */
  position: absolute;
  cursor: pointer;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  @keyframes pulse {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .pulse-box {
    background-image: radial-gradient(#ffffff33, #ffffffaa);
    animation: pulse 1s infinite;
    width: 100%;
    height: 100%;
  }
  .downarrow {
    /* position: absolute; */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
const PulsingTarget = ({ roomId, active }) => {
  // const { clickHouseTarget } = useClickMoveCtx()
  if (!active) return null
  return (
    <TargetBox>
      {/* <div className="pulse-box"></div> */}
      <div className="downarrow">
        <FaArrowDown />
      </div>
      {/* <PulsingBG className='pulse'/> */}
      {/* <FaBullseye className="pulse" /> */}
    </TargetBox>
  )
}

export default PulsingTarget
