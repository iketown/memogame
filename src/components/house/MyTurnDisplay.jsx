import React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import TurnTimerStack from "./TurnTimerStack"
import { useTurnTimer } from "../../hooks/useTurnTimer"

const YourTurnDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  .your-turn {
    color: red;
  }
  .seconds {
    font-size: 2rem;
    font-weight: bold;
    color: grey;
  }
`
const MyTurnDisplay = () => {
  const { secondsLeft } = useTurnTimer()
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "space-between"
      }}
    >
      <YourTurnDiv>
        <div className="your-turn">
          <b>YOUR</b>
          <br />
          <b>TURN</b>
        </div>
        <div className="seconds">{secondsLeft}</div>
      </YourTurnDiv>
      <TurnTimerStack secondsLeft={secondsLeft} />
    </div>
  )
}

export default MyTurnDisplay
