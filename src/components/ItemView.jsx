import React from "react"
import styled from "styled-components"
import { List, ListItem, ListItemText } from "@material-ui/core"

const ItemBox = styled.div`
  border: 1px solid grey;
  border-radius: 5px;
`

const ItemView = ({ item }) => {
  return <ItemBox>item page</ItemBox>
}

export default ItemView
