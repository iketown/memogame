import React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import spinner from "../../../images/BrainLoader/spinnerGear.svg"
import { useHouseCtx } from "../../../contexts/GameCtx"

//
//
const TimerCountdown = styled.div`
  background: #ffffff99;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const Spinner = styled.div`
  background-image: url(${spinner});
  background-size: cover;
  height: 100%;
  width: 100%;
  opacity: ${p => (p.visible ? 0.5 : 0)};
  transition: 0.5s opacity;
`
const BigSpinner = styled.div`
  background-image: url(${spinner});
  background-size: cover;
  height: 100%;
  width: 100%;
  transition: 0.5s opacity;
  opacity: ${p => (p.visible ? 0.5 : 0)};
  grid-area: 1/1/-1/-1;
`

const TimerGridCountdown = styled(TimerCountdown)`
  @keyframes rotation {
    from {
      transform: rotate(359deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
  .rotate {
    animation: rotation 2s infinite linear;
  }
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
`
const TimerGridOverlay = ({ secondsLeft }) => {
  return (
    <TimerGridCountdown>
      {Array.from({ length: 16 }).map((_, index) => {
        return (
          <Spinner
            visible={!secondsLeft ? false : index < secondsLeft}
            className="rotate"
            key={`gear${index}`}
          ></Spinner>
        )
      })}
      {!secondsLeft && <BigSpinner className="rotate" visible={true} />}
    </TimerGridCountdown>
  )
}

export default TimerGridOverlay
