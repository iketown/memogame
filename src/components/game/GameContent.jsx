import React from "react"
import { Grid, Typography } from "@material-ui/core"
//
import { useGameCtx } from "../../contexts/GameCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import YoureNotInThisGameYet from "./gameAdmin/YoureNotInThisGameYet.jsx"
import HouseGrid from "../house/HouseGrid.jsx"
import GameStarter from "./gameAdmin/GameStarter.jsx"
//
//
const GameContent = ({ gameId }) => {
  const { gameState } = useGameCtx()

  const { user } = useAuthCtx()
  const members = gameState && gameState.members
  if (!members) return <div>no members</div>
  const youAreAMember = members.find(mem => mem.uid === user.uid)
  const thisIsYourGame = gameState && gameState.startedBy === user.uid
  const gameMemberView = (
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
  )
  const nonGameMemberView = <YoureNotInThisGameYet />
  return youAreAMember ? gameMemberView : nonGameMemberView
}

export default GameContent
