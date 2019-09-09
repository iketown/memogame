import React from "react"
import Loader from "react-loader-spinner"
import styled from "styled-components"
import { Typography } from "@material-ui/core"

//
//
const WhiteBG = styled.div`
  height: 100%;
  width: 100%;
  background-color: #ffffff80;
  display: flex;
  justify-content: center;
  align-items: center;
  .clock-container {
    width: 80%;
    height: 80%;
  }
  .number {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`
const ClockOverlay = ({ secondsLeft }) => {
  return (
    <WhiteBG secondsLeft={secondsLeft}>
      <div className="clock-container">
        <Loader
          color="rgba(0,0,256,.4)"
          type="Watch"
          height="100%"
          width="100%"
        ></Loader>
        <Typography variant="h4" className="number">
          {secondsLeft}
        </Typography>
      </div>
    </WhiteBG>
  )
}

export default ClockOverlay
