import React from "react"
import styled from "styled-components"
//
import { useTurnTimer } from "../../hooks/useTurnTimer"

//
//
const StyleStack = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1.5rem);
  grid-gap: 4px;
`
const Box = styled.div`
  background: ${p => (!p.visible ? "white" : p.selected ? "red" : "gainsboro")};
  /* opacity: ${p => (p.visible ? 1 : 0)}; */
  border: 1px solid gainsboro;
  transition: .5s background-color;
  text-align: center;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`
const secondsPerTurn = 26
const TurnTimerStack = ({ secondsLeft }) => {
  return (
    <>
      <StyleStack spt={secondsPerTurn}>
        {Array.from({ length: 24 }, x => "x").map((x, i) => {
          const number = 24 - i
          const next = number + 1 === secondsLeft
          return (
            <Box
              key={`box${i}`}
              visible={number < secondsLeft}
              selected={number === secondsLeft}
              next={next}
            >
              {/* {next ? number : ""} */}
            </Box>
          )
        })}
      </StyleStack>
      {/* <div>sec left: {secondsLeft}</div> */}
    </>
  )
}

export default TurnTimerStack
