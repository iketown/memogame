import React from "react"
import { Typography, Grid } from "@material-ui/core"

const typeVariants = [
  "body1",
  "body2",
  "button",
  "caption",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "inherit",
  "overline",
  "srOnly",
  "subtitle1",
  "subtitle2"
]
const Home = () => {
  return (
    <Grid container spacing={2}>
      {typeVariants.map(variant => {
        return (
          <Grid key={variant} item xs={12}>
            <Typography variant={variant}>I am {variant} HELLO</Typography>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default Home
