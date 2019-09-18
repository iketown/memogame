import React, { useState, useEffect, useRef, memo } from "react"
import styled from "styled-components"
import isEqual from "lodash/isEqual"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx"

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
  border-radius: ${p => (p.circular ? "50%" : "1rem")};
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
const BlinkerContainer = ({ circular = true, displayPlayer }) => {
  const { gamePlay } = useGamePlayCtx()
  const centerCardPile = (gamePlay && gamePlay.centerCardPile) || []
  const lastCardBy = gamePlay && gamePlay.lastCardBy
  return (
    <Blinker
      centerCardPile={centerCardPile}
      lastCardBy={lastCardBy}
      displayPlayer={displayPlayer}
      circular={circular}
    />
  )
}

const Blinker = memo(
  ({ centerCardPile, circular, lastCardBy, displayPlayer = "all" }) => {
    const [blinking, setBlinking] = useState(false)
    const cardCountRef = useRef()
    const pileRef = useRef()
    const pileCount = centerCardPile.length

    useEffect(() => {
      if (
        cardCountRef.current &&
        (lastCardBy === displayPlayer || displayPlayer === "all")
      ) {
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
    }, [centerCardPile, displayPlayer, lastCardBy, pileCount])

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
          circular={circular}
          color={colors[blinking.color]}
          blinking={!!blinking}
          quantity={blinking.quantity}
        />
      </>
    )
  },
  blinkPropsEqual
)

function blinkPropsEqual(prev, next) {
  const _equal = isEqual(prev, next)
  return _equal
}

export default BlinkerContainer
