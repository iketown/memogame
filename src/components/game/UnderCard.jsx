import React, { useMemo } from "react"
import styled from "styled-components"
//
import { defaultHeight, cardShadow } from "../ItemCard"
import imgs from "../../images/cards"
import { useItemCtx } from "../../contexts/ItemContext"
import { removeUid } from "../../utils/imageUtils"
//
//
const StyledUnderCard = styled.div`
  border: 1px solid grey;
  position: absolute;
  /* ${p =>
    p.item ? `background-image: url(${p => imgs[p.item.name]});` : ""} */
  background-image: url(${p => p.item && imgs[p.item.name]});
  background-size: cover;
  background-color: ${p => (p.index < 3 ? "white" : "#efefef")};
  height: ${defaultHeight};
  width: ${defaultHeight};
  top: ${p => p.top}px;
  left: ${p => p.left}px;
  /* top: 0;
  left: 0; */
  transform: rotate(${p => p.rotate}deg) scale(${p => p.scale});
  z-index: ${p => -3 * p.index};
  ${cardShadow}
`
const UnderCard = ({ index, itemId }) => {
  const { allItems } = useItemCtx()
  const { top, left, rotate, scale } = useMemo(() => {
    return {
      top: index * 3 * Math.random(),
      left: index * 3 * Math.random(),
      rotate: index * 2 * (Math.random() - 0.5),
      scale: 1 - 0.015 * index
    }
  }, [index])
  return (
    <StyledUnderCard
      item={itemId && index == 1 ? allItems[removeUid(itemId)] : null}
      index={index}
      top={top}
      left={left}
      rotate={rotate}
      scale={scale}
    />
  )
}

export default UnderCard
