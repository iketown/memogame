import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Card, Typography, Button } from "@material-ui/core"
//
import TimerOverlay from "./TimerOverlay"
import { useAllItemsCtx } from "../../../contexts/AllItemsCtx"
import { removeUid } from "../../../utils/imageUtils"
import { useWiderThan } from "../../../hooks/useScreenSize"
import brain from "../../../images/newCards/brain.svg"
import { FaThinkPeaks } from "react-icons/fa"
import ClockOverlay from "./ClockOverlay"

const StyledSorterCard = styled(Card)`
  width: ${p => p.width}rem;
  height: ${p => p.width}rem;
  /* background-image: url(${p => p.image}); */
  background-image: url(${p => (p.peek ? p.images[1] : p.images[0])});
  background-size: cover;
  border: 5px solid white;
  padding: 5px;
  margin: 8px;
  position: relative;
`

const SorterCard = ({
  itemId,
  faceUp,
  secondsLeft,
  restricted,
  handlePeek,
  peek
}) => {
  const { allItems } = useAllItemsCtx()

  // const image = peek ? allItems[removeUid(itemId)].card : brain
  const images = [brain, allItems[removeUid(itemId)].card]
  const mdUp = useWiderThan("md")
  return (
    <StyledSorterCard
      width={mdUp ? 6.5 : 4.5}
      // image={image}
      images={images}
      peek={faceUp}
    >
      {restricted && !faceUp && <ClockOverlay secondsLeft={secondsLeft} />}
    </StyledSorterCard>
  )
}

export default SorterCard
