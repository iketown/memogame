import React from "react"
import { Container, Grid } from "@material-ui/core"

//
//
const CreateGame = () => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          Create a Game
        </Grid>
      </Grid>
    </Container>
  )
}

export default CreateGame

// create a game in Firestore,
//  firestore:  who is playing
// firestore: who owns game
// firestore: ability to save game half way thru?
// - - when its your turn, you can pause the game, others see that
// - - you paused it.

// rtdb: turn by turn state changes
