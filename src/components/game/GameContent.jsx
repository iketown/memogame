import React from "react"
import { Grid, Typography, Container } from "@material-ui/core"
import { Link } from "react-router-dom"
//
import ShowMe from "../../utils/ShowMe.jsx"
import { useGameCtx } from "../../contexts/GameCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import YoureNotInThisGameYet from "./gameAdmin/YoureNotInThisGameYet.jsx"
import HouseGrid from "../house/HouseGrid.jsx"
import GameStarter from "./gameAdmin/GameStarter.jsx"
import { usePlayersCtx } from "../../contexts/PlayersCtx"
import PendingGameView from "./gameAdmin/PendingGameView.jsx"
//
//
const GameContent = ({ gameId }) => {
  const { gameState } = useGameCtx()
  const { players } = usePlayersCtx()
  const { user } = useAuthCtx()
  const memberUIDs = gameState && gameState.memberUIDs
  if (!memberUIDs)
    return (
      <Container>
        <div
          style={{
            margin: "20vh auto",
            textAlign: "center"
          }}
        >
          game doesnt exist. 🤷‍♂️ <Link to="/gamestart">Start a GAME</Link>
        </div>
      </Container>
    )
  const youAreAMember = memberUIDs.includes(user.uid)
  const thisIsYourGame = gameState && gameState.startedBy === user.uid
  const gameOn = gameState && gameState.inProgress
  const gameOffView = <PendingGameView />
  const nonGameMemberView = <YoureNotInThisGameYet />
  const gameMemberView = gameOn ? (
    <Grid container spacing={2}>
      <Grid item xs={!thisIsYourGame ? 12 : 4}>
        <Typography variant="h4" style={{ textAlign: "center" }}>
          {gameState && gameState.gameName.toUpperCase()}
        </Typography>
      </Grid>
      {thisIsYourGame && (
        <Grid item xs={8}>
          <GameStarter />
        </Grid>
      )}
      <Grid item xs={12}>
        <HouseGrid gameId={gameId} />
      </Grid>
    </Grid>
  ) : (
    gameOffView
  )
  return youAreAMember ? gameMemberView : nonGameMemberView
}

export default GameContent
