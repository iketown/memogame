import React from "react"
import styled from "styled-components"
import { Card, Typography } from "@material-ui/core"
//
import TimerOverlay from "./TimerOverlay"
import { useAllItemsCtx } from "../../../contexts/AllItemsCtx"
import { removeUid } from "../../../utils/imageUtils"
import { useWiderThan } from "../../../hooks/useWidth"
import brain from "../../../images/newCards/brain.svg"

const StyledSorterCard = styled(Card)`
  width: ${p => p.width}rem;
  height: ${p => p.width}rem;
  background-image: url(${p => p.image});
  background-size: cover;
  border: 5px solid white;
  padding: 5px;
  margin: 8px;
  position: relative;
`

const SorterCard = ({ itemId, faceUp, secondsLeft, restricted }) => {
  const { allItems } = useAllItemsCtx()
  const image = faceUp ? allItems[removeUid(itemId)].card : brain
  const mdUp = useWiderThan("md")
  return (
    <StyledSorterCard width={mdUp ? 6.5 : 4.5} image={image}>
      {restricted && !faceUp && <TimerOverlay secondsLeft={secondsLeft} />}
    </StyledSorterCard>
  )
}

export default SorterCard