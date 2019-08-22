import React from "react"
import styled from "styled-components"

export const defaultHeight = "8rem"
export const cardShadow = `box-shadow: 1px 1px 2px #c1c1c1;`
const StyledCard = styled.div`
  background-image: url(${p => p.item.card});
  background-color: white;
  background-size: cover;
  height: ${p => p.height || defaultHeight};
  width: ${p => p.height || defaultHeight};
  border: 5px solid white;
  ${cardShadow}
`
const ItemCard = ({ item, height = defaultHeight }) => {
  return <StyledCard item={item} height={height} />
}

export default ItemCard
