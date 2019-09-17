import React, { useState, useEffect, useRef, memo } from "react"
import ReactSVG from "react-svg"
import { Button } from "@material-ui/core"
import styled from "styled-components"
import centerPlate from "../../../images/centerPlate.svg"
import { useWiderThan } from "../../../hooks/useScreenSize"
import isEqual from "lodash/isEqual"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx"
const PlateBackground = styled.div`
  background-image: url(${centerPlate});
  background-size: cover;
  height: ${p => (p.mdUp ? "12rem" : "10rem")};
  width: ${p => (p.mdUp ? "12rem" : "10rem")};
  position: relative;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;

  ::before {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    content: "";
    ${p => p.canDrop && "background: #ffff006b;"}
    ${p => p.isOver && "background: #8bc34a59;"}
    border-radius: 50%;
  }
`

const BlinkingDiv = styled.div`
  @keyframes example {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
    /* 100% {
      background-color: #ffffff00;
    } */
  }
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  content: "";
  border-radius: 50%;
  background-color: ${p => p.color};
  opacity: 0;
  ${p =>
    p.blinking &&
    `
    animation-name: example;
    animation-duration: .25s;
    animation-iteration-count: ${p.quantity};
    animation-timing-function: linear;
  `}
`

//
//
const CenterPlateSvg = memo(({ children, isOver, canDrop }) => {
  const mdUp = useWiderThan("md")
  console.log("rendering CenterPlateSvg")
  return (
    <>
      <PlateBackground mdUp={mdUp} isOver={isOver} canDrop={canDrop}>
        <BlinkerContainer />
        {children}
      </PlateBackground>
    </>
  )
}, propsEqual)
function propsEqual(prev, next) {
  const _equal = isEqual(prev, next)
  console.log("CenterPlate props", prev, next, _equal)
  return _equal
}

export default CenterPlateSvg

const BlinkerContainer = () => {
  const { gamePlay } = useGamePlayCtx()
  const centerCardPile = (gamePlay && gamePlay.centerCardPile) || []
  return <Blinker centerCardPile={centerCardPile} />
}

const Blinker = memo(({ centerCardPile }) => {
  const [blinking, setBlinking] = useState(false)
  const cardCountRef = useRef()
  const pileRef = useRef()
  const pileCount = centerCardPile.length

  useEffect(() => {
    if (cardCountRef.current) {
      if (
        cardCountRef.current > pileCount ||
        cardCountRef.current[0] !== centerCardPile[0]
      ) {
        const quantity = Math.max(1, cardCountRef.current - pileCount)
        console.log("quantity cardCount", quantity)
        setBlinking({ color: "red", quantity })
      }
      if (cardCountRef.current < pileCount) {
        console.log("GAINED SOME cardCount")
        console.log("cardCountRef.current cardCount", cardCountRef.current)
        console.log("pileCount cardCount", pileCount)
        const quantity = 1
        setBlinking({ color: "green", quantity })
      }
    }
    pileRef.current = centerCardPile
    cardCountRef.current = pileCount
  }, [centerCardPile, pileCount])

  const timerRef = useRef()

  useEffect(() => {
    if (!!blinking) {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setBlinking(false)
      }, (1000 * blinking.quantity) / 4)
      return () => {
        clearTimeout(timerRef.current)
      }
    }
  }, [blinking])
  const colors = {
    yellow: "#ffff0075",
    green: "#3fff0069",
    red: "#ff000052"
  }
  console.log("cardCount blinking", blinking)
  return (
    <>
      <BlinkingDiv
        color={colors[blinking.color]}
        blinking={!!blinking}
        quantity={blinking.quantity}
      />
      {/* <Button onClick={() => setBlinking("yellow")}>yellow</Button>
      <Button onClick={() => setBlinking("red")}>red</Button>
      <Button onClick={() => setBlinking("green")}>green</Button> */}
    </>
  )
}, blinkPropsEqual)

function blinkPropsEqual(prev, next) {
  const _equal = isEqual(prev, next)
  return _equal
}
