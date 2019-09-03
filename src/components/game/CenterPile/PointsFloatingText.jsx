import React, { useState } from "react"
import styled from "styled-components"
import { Button } from "@material-ui/core"
import { FaStar, FaCircle } from "react-icons/fa"
import { useTransition, animated, config } from "react-spring"
import ShowMe from "../../../utils/ShowMe.jsx"
//
//
const BigDiv = styled.div`
  z-index: 200;
  /* position: absolute; */
  /* left: -20px; */
  .star-container {
    position: relative;
  }
  .number {
    font-size: 2.5rem;
    color: white;
    font-family: monospace;
    font-weight: bold;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -62%);
  }
  .star {
    font-size: 4rem;
    color: green;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`

const PointsFloatingText = () => {
  const [stars, setStars] = useState([2])
  const nums = [1, 5, 10, 15, 20]
  const transitions = useTransition(stars, item => item, {
    from: { opacity: 0.5, transform: "translate(80px, 0px)" },
    enter: { opacity: 1, transform: "translate(0px, 0px)" },
    leave: { opacity: 0, transform: "translate(0px, -40px)" },
    config: config.gentle
  })
  return (
    <div>
      <Button onClick={() => setStars(old => [...old, nums[old.length]])}>
        add one
      </Button>
      <Button onClick={() => setStars(old => [...old.slice(1)])}>
        subtract
      </Button>
      <ShowMe obj={stars} name="stars" />

      {transitions.map(({ item, key, props }) => {
        return (
          item && (
            <animated.div key={key} style={props}>
              <BigDiv>
                <div className="star-container">
                  <span className="star ctr">
                    <FaStar />
                  </span>
                  <span className="number ctr">1</span>
                </div>
              </BigDiv>
            </animated.div>
          )
        )
      })}
    </div>
  )
}

export default PointsFloatingText
