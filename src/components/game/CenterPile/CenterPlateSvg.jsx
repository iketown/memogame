import React from "react"
import ReactSVG from "react-svg"
import styled from "styled-components"
import centerPlate from "../../../images/centerPlate.svg"
import { useWiderThan } from "../../../hooks/useScreenSize"

const canDropBG = `radial-gradient(yellow 59%, white 69%, transparent)`
const isOverBG = `radial-gradient(green 59%, white 69%, transparent)`

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

//
//
const CenterPlateSvg = ({ children, isOver, canDrop }) => {
  const mdUp = useWiderThan("md")
  return (
    <PlateBackground mdUp={mdUp} isOver={isOver} canDrop={canDrop}>
      {children}
    </PlateBackground>
  )
}

export default CenterPlateSvg
