import React, { useState, useEffect, useRef, useMemo, memo } from "react"
import ReactSVG from "react-svg"
import { Button } from "@material-ui/core"
import styled from "styled-components"
import centerPlate from "../../../images/centerPlate.svg"
import { useWiderThan } from "../../../hooks/useScreenSize"
import isEqual from "lodash/isEqual"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx"

const PlateContainer = styled.div`
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
const CenterPlateSvg = memo(({ children, isOver, canDrop }) => {
  const mdUp = useWiderThan("md")
  console.log("rendering CenterPlateSvg")
  const plate = useMemo(() => <PlateImage />, [])
  return (
    <PlateContainer mdUp={mdUp} isOver={isOver} canDrop={canDrop}>
      {plate}
      {children}
    </PlateContainer>
  )
}, propsEqual)
function propsEqual(prev, next) {
  const _equal = isEqual(prev, next)
  console.log("CenterPlate props", prev, next, _equal)
  return _equal
}

const PlateImageDiv = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url(${centerPlate});
  background-size: cover;
`
const PlateImage = () => {
  return <PlateImageDiv />
}

export default CenterPlateSvg
