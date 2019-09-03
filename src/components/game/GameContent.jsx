import React from "react"
import { Grid, Typography } from "@material-ui/core"
//
import ShowMe from "../../utils/ShowMe.jsx"
import { useGameCtx } from "../../contexts/GameCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import YoureNotInThisGameYet from "./gameAdmin/YoureNotInThisGameYet.jsx"
import HouseGrid from "../house/HouseGrid.jsx"
import GameStarter from "./gameAdmin/GameStarter.jsx"
import { usePlayersCtx } from "../../contexts/PlayersCtx"
//
//
const GameContent = ({ gameId }) => {
  const { gameState } = useGameCtx()
  const { players } = usePlayersCtx()
  const { user } = useAuthCtx()
  const memberUIDs = gameState && gameState.memberUIDs
  if (!memberUIDs) return <div>no members</div>
  const youAreAMember = memberUIDs.includes(user.uid)
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
