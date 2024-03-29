import React, { useMemo, memo } from "react"
import styled from "styled-components"
import centerPlate from "../../../images/centerPlate.svg"
import { useWiderThan } from "../../../hooks/useScreenSize"
import isEqual from "lodash/isEqual"

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
  const plate = useMemo(() => <PlateImage />, [])
  return (
    <PlateContainer
      onClick={e => e.stopPropagation()}
      mdUp={mdUp}
      isOver={isOver}
      canDrop={canDrop}
    >
      {plate}
      {children}
    </PlateContainer>
  )
}, propsEqual)
function propsEqual(prev, next) {
  const _equal = isEqual(prev, next)
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
