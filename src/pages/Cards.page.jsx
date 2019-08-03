import React from "react"
import { CardContent, Card, Grid, Typography } from "@material-ui/core"
import styled from "styled-components"
//
import { useAttrCtx } from "../contexts/AttrContext"
import { useItemCtx } from "../contexts/ItemContext"
import ItemCard from "../components/ItemCard.jsx"
//
//
const Cards = () => {
  const { allItems } = useItemCtx()

  return (
    <Grid container spacing={2}>
      {Object.entries(allItems).map(([itemId, item]) => {
        return (
          <Grid key={itemId} item xs={6} sm={4} md={3}>
            <ItemCard item={item} />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default Cards
