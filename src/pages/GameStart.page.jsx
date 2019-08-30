import React, { useState } from "react"
import { Form, Field } from "react-final-form"
import { Grid, TextField, Typography, Button } from "@material-ui/core"
//
import { useFirebase } from "../contexts/FirebaseCtx"

//
//
const GameStart = ({ history }) => {
  const [gameName, setGameName] = useState("")
  const { doCreateGame } = useFirebase()
  const handleCreateGame = () => {
    doCreateGame({ gameName })
      .then(({ id }) => {
        history.push(`/game/${id}`)
      })
      .catch(err => console.log("error in handleCreateGame", err))
  }
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography variant="h4">1. Name a game</Typography>
        <TextField
          value={gameName}
          onChange={e => setGameName(e.target.value)}
          label="Name"
        />
        <Typography variant="h4">2. Start it up</Typography>
        <Button
          variant="outlined"
          color="primary"
          disabled={!gameName}
          onClick={handleCreateGame}
        >
          Go
        </Button>
      </Grid>
      <Grid item xs={6} />
    </Grid>
  )
}

export default GameStart
