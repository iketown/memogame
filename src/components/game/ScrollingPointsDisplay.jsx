import React, { useState, useEffect } from "react"
import { Typography } from "@material-ui/core"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import styled from "styled-components"
//
const PointsContainer = styled.div`
  .points-display {
    display: flex;
    justify-content: center;
    position: relative;
    transform: translateY(-20px);
  }
  .points-always {
    position: absolute;
    /* top: -20px;
    left: 50%;
    transform: translateX(-50%);  */
  }
  .points-enter {
    transform: translateY(${p => (p.goingUp ? "100%" : "-100%")});
    opacity: 0;
    color: ${p => (p.goingUp ? "green" : "red")};
  }
  .points-enter-active {
    transform: translateY(0%);
    opacity: 1;
    transition: all 0.7s 1s;
  }
  .points-enter-done {
    color: inherit;
    transition: 1s color;
  }
  .points-exit {
    transform: translateY(0%);
    opacity: 1;
  }
  .points-exit-active {
    transform: translateY(${p => (p.goingUp ? "-100%" : "100%")});
    opacity: 0;
    transition: all 0.7s 1s;
  }
  .points-exit-done {
  }
`
//
//
const ScrollingPointsDisplay = ({ points, ...props }) => {
  const [pointsArr, setPointsArr] = useState([points])
  useEffect(() => {
    if (points !== pointsArr[0]) {
      setPointsArr(old => [points, old[0]])
    }
  }, [points, pointsArr])
  return (
    <div {...props}>
      <PointsContainer goingUp={pointsArr[0] > pointsArr[1]}>
        <TransitionGroup className="points-display">
          {pointsArr.map((val, index) => {
            if (index !== 0) return null
            return (
              <CSSTransition
                key={`${val}-${index}`}
                timeout={3000}
                classNames="points"
              >
                <Typography
                  className="points-always"
                  variant="h5"
                  style={{ marginBottom: "-10px" }}
                >
                  {val}
                </Typography>
              </CSSTransition>
            )
          })}
        </TransitionGroup>
        {/* <Typography variant="overline" color="textSecondary">
          POINTS
        </Typography> */}
      </PointsContainer>
    </div>
  )
}

export default ScrollingPointsDisplay
