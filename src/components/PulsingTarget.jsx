import React from "react"
import styled from "styled-components"
import { FaBullseye } from "react-icons/fa"

const TargetBox = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 4rem;
  color: magenta;
  @keyframes pulse {
    0% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(0.5);
    }
  }
  .pulse {
    animation: pulse 1s infinite;
  }
`
const PulsingTarget = () => {
  return (
    <TargetBox>
      <FaBullseye className="pulse" />
    </TargetBox>
  )
}

export default PulsingTarget
