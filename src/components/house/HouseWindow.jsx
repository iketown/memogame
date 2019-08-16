import React, { useState, useMemo } from "react"
import styled from "styled-components"
import { Card } from "@material-ui/core"
//
import brain from "../../images/cards/brain.svg"
import { useWidth, useWiderThan } from "../../hooks/useWidth"
import { houseDimensions } from "./HouseGrid"
import { useHouseGridCtx } from "../../contexts/HouseGridCtx"
import ShowMe from "../../utils/ShowMe"
import { useGameCtx } from "../../contexts/GameCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"
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
    background-image: url(${brain});
    background-size: cover;
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

const HouseWindow = ({
  display,
  roomId,
  expanded,
  setExpanded,
  indicateNoDrop,
  enlarge,
  cardsThisRoom
}) => {
  const { houseState, expandedRoom, setExpandedRoom } = useHouseGridCtx()
  const { house } = houseState
  const rotations = useMemo(() => {
    return Array.from({ length: 3 }, _ => (Math.random() - 0.5) * 14)
  }, [])

  return (
    <ExpandingWindow
      enlarge={enlarge}
      style={{ opacity: indicateNoDrop ? 0.4 : 1 }}
      rotations={rotations}
      className={"houseWindow"}
      expanded={expandedRoom}
      onClick={e => {
        e.stopPropagation()
        setExpandedRoom(old =>
          old.roomId === roomId ? false : { roomId, faceUp: false }
        )
      }}
    >
      <Name>{indicateNoDrop ? "FULL" : display.toUpperCase()}</Name>
      {cardsThisRoom.map((c, index) => (
        <WindowCard expanded={expanded} key={(c, index)} index={index + 1} />
      ))}
    </ExpandingWindow>
  )
}

export default HouseWindow

const offsetMultiplier = 4
const StyledCard = styled(Card)`
  height: ${p => p.heightwidth}px;
  width: ${p => p.heightwidth}px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: ${p => p.index * offsetMultiplier}px;
  left: ${p => p.index * offsetMultiplier - 8}px;
  z-index: ${p => (p.expanded ? 10 - p.index : 5 - p.index)};
`
const WindowCard = ({ index, expanded }) => {
  const mdUp = useWiderThan("md")
  return (
    <StyledCard
      expanded={expanded}
      heightwidth={mdUp ? 90 : 65}
      index={index}
      className={`cards card${index}`}
    >
      {index}
    </StyledCard>
  )
}
