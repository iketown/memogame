import React from "react"
import { Grid } from "@material-ui/core"
//
import { useGameCtx } from "../../contexts/GameCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import YoureNotInThisGameYet from "./gameAdmin/YoureNotInThisGameYet.jsx"
import ShowMe from "../../utils/ShowMe.jsx"
import House from "../house/House.jsx"
import GameStarter from "./gameAdmin/GameStarter.jsx"
import PlayResponse from "./PlayResponse"
//
//
const GameContent = ({ gameId }) => {
  const { gameState, gamePlay } = useGameCtx()
  const { user } = useAuthCtx()
  const members = gameState && gameState.members
  if (!members) return <div>no members</div>
  const youAreAMember = members.find(mem => mem.uid === user.uid)
  const thisIsYourGame = gameState && gameState.startedBy === user.uid
  const gameMemberView = (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {thisIsYourGame && <GameStarter />}
      </Grid>
      <PlayResponse />
      <Grid item xs={12}>
        <House gameId={gameId} />
      </Grid>
    </Grid>
  )
  const nonGameMemberView = <YoureNotInThisGameYet />
  return youAreAMember ? gameMemberView : nonGameMemberView
}

export default GameContent
