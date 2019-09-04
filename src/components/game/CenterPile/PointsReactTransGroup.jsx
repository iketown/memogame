import React, { useEffect } from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import styled from "styled-components"
//
import { usePointsCtx } from "../../../contexts/GameCtx"
import { FaStar } from "react-icons/fa"
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

const StarContainer = styled.div`
  position: absolute;
  top: 30%;
  left: 0;
  z-index: 200;
  .staranimation-enter {
    opacity: 0;
    transform: translateX(30px);
  }
  .staranimation-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: 0.3s all;
  }
  .staranimation-enter-done {
  }
  .staranimation-exit {
    opacity: 1;
    transform: translateY(0);
  }
  .staranimation-exit-active {
    opacity: 0;
    transform: translateY(-30px);
    transition: 0.3s all;
  }
  .staranimation-exit-done {
    transform: translateY(-30px);
    opacity: 0;
  }
`

const PointsReactTransGroup = () => {
  const pauseDuration = 1500
  const { pointsDisplay, setPointsDisplay } = usePointsCtx()
  useEffect(() => {
    if (pointsDisplay) {
      setTimeout(() => setPointsDisplay(false), pauseDuration)
    }
  }, [pointsDisplay, setPointsDisplay])
  return (
    <StarContainer>
      <TransitionGroup>
        {pointsDisplay && (
          <CSSTransition
            classNames="staranimation"
            in={pointsDisplay}
            timeout={1200}
          >
            <BigDiv>
              <div className="star-container">
                <span className="star ctr">
                  <FaStar />
                </span>
                <span className="number ctr">{pointsDisplay}</span>
              </div>
            </BigDiv>
          </CSSTransition>
        )}
      </TransitionGroup>
    </StarContainer>
  )
}

export default PointsReactTransGroup
