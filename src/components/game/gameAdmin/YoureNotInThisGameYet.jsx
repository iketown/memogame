import React from "react"
import { Button, Typography } from "@material-ui/core"
import styled from "styled-components"
//
import { useGameCtx } from "../../../contexts/GameCtx"
import { useAuthCtx } from "../../../contexts/AuthCtx"
//
//
const CenterStyle = styled.div`
  margin: 2rem auto;
  text-align: center;
`
const YoureNotInThisGameYet = ({ gameId }) => {
  const { gameState, requestJoinGame, removeRequest } = useGameCtx()
  const { user } = useAuthCtx()
  const alreadyRequestedThisGame =
    gameState.memberRequests &&
    gameState.memberRequests.find(req => req.uid === user.uid)
  if (alreadyRequestedThisGame) {
    return (
      <CenterStyle>
        your request is pending...
        <Button onClick={removeRequest}>remove request</Button>
      </CenterStyle>
    )
  }
  if (gameState && gameState.inProgress) {
    return <CenterStyle>game already in progress</CenterStyle>
  }
  return (
    <CenterStyle>
      <Typography variant="h4">{gameState.gameName}</Typography>
      <Typography variant="subtitle1" gutterBottom>
        is accepting new players
      </Typography>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={() => requestJoinGame(gameId)}
      >
        request to join
      </Button>
    </CenterStyle>
  )
}

export default YoureNotInThisGameYet
