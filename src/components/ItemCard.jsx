import React from "react"
import imgs from "../images/cards"
import styled from "styled-components"
import { useItemCtx } from "../contexts/ItemContext"
const height = "8rem"

const StyledCard = styled.div`
  background-image: url(${p => imgs[p.item.name]});
  background-size: cover;
  height: ${height};
  width: ${height};
  border: 1px solid grey;
`
const ItemCard = ({ item }) => {
  return <StyledCard item={item} />
}

export default ItemCard
