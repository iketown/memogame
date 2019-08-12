import React, { useState, useMemo } from "react"
import styled from "styled-components"
import { Card } from "@material-ui/core"
//
import { useWidth } from "../../hooks/useWidth"
import { houseDimensions } from "./HouseGrid"
import { useHouseGridCtx } from "../../contexts/HouseGridCtx"
import ShowMe from "../../utils/ShowMe"
//
//

const Name = styled.h4`
  position: absolute;
  top: -22px;
  left: 50%;
  padding: 4px;
  border-radius: 5px;
  transform: translateX(-50%);
  background-color: #ffffff59;
  margin: 0;
`

const ExpandingWindow = styled.div`
  .cards {
    transition: transform 0.3s;
  }
  .card1 {
    transform: rotate(${p => p.rotations[0]}deg);
  }
  .card2 {
    transform: rotate(${p => p.rotations[1]}deg);
  }
  .card3 {
    transform: rotate(${p => p.rotations[2]}deg);
  }
`

const HouseWindow = ({ display, roomId, expanded, setExpanded }) => {
  const { houseState } = useHouseGridCtx()
  const { house } = houseState
  const rotations = useMemo(() => {
    return Array.from(["", "", ""], _ => (Math.random() - 0.5) * 14)
  }, [])

  const fakeCards = house[roomId]
  return (
    <ExpandingWindow
      rotations={rotations}
      className={"houseWindow"}
      expanded={expanded}
      onClick={e => {
        e.stopPropagation()
        setExpanded(old => (old === roomId ? false : roomId))
      }}
    >
      <Name>{display.toUpperCase()}</Name>
      {fakeCards.map((c, index) => (
        <WindowCard expanded={expanded} key={(c, index)} index={index + 1} />
      ))}
    </ExpandingWindow>
  )
}

export default HouseWindow

const offsetMultiplier = 4
const StyledCard = styled(Card)`
  height: ${p => p.heightwidth};
  width: ${p => p.heightwidth};
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: ${p => p.index * offsetMultiplier}px;
  left: ${p => p.index * offsetMultiplier - 8}px;
  z-index: ${p => (p.expanded ? 10 - p.index : 5 - p.index)};
`
const WindowCard = ({ index, expanded }) => {
  const widthText = useWidth()
  const { windowHeight } = houseDimensions[widthText]

  return (
    <StyledCard
      expanded={expanded}
      heightwidth={windowHeight}
      index={index}
      className={`cards card${index}`}
    >
      {index}
    </StyledCard>
  )
}
