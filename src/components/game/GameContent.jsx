import React, { useMemo } from "react"
import { Grid, Typography } from "@material-ui/core"
//
import { useGameCtx } from "../../contexts/GameCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import YoureNotInThisGameYet from "./gameAdmin/YoureNotInThisGameYet.jsx"
import GameStarter from "./gameAdmin/GameStarter.jsx"
import PendingGameView from "./gameAdmin/PendingGameView.jsx"
import SpinningPageLoader from "../SpinningPageLoader.jsx"
import GamePage from "./GamePage.responsive.jsx"
import GameOver from "../../pages/GameOver"
//
//
const GameContent = () => {
  const { gameState } = useGameCtx("GameContent")
  const { user } = useAuthCtx()
  const memberUIDs = gameState && gameState.memberUIDs
  const thisIsYourGame = useMemo(
    () => gameState && gameState.startedBy === user.uid,
    [gameState, user.uid]
  )
  if (!memberUIDs) return <SpinningPageLoader />
  const youAreAMember = memberUIDs.includes(user.uid)

  const gameOn = gameState && gameState.inProgress
  const gameOnView = (
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
        <GamePage />
      </Grid>
    </Grid>
  )
  const gameOver = !!gameState.completed && !gameState.inProgress

  const gameOffView = <PendingGameView />
  function getView() {
    switch (true) {
      case gameOver:
        return <GameOver />
      case !youAreAMember:
        return <YoureNotInThisGameYet />
      case gameOn:
        return gameOnView
      case !gameOn:
        return gameOffView
      default:
        return gameOffView
    }
  }
  // const gameMemberView = gameOn ? (
  //   <Grid container spacing={2}>
  //     <Grid item xs={!thisIsYourGame ? 12 : 4}>
  //       <Typography variant="h4" style={{ textAlign: "center" }}>
  //         {gameState && gameState.gameName.toUpperCase()}
  //       </Typography>
  //     </Grid>
  //     {thisIsYourGame && (
  //       <Grid item xs={8}>
  //         <GameStarter />
  //       </Grid>
  //     )}
  //     <Grid item xs={12}>
  //       <GamePage />
  //     </Grid>
  //   </Grid>
  // ) : (
  //   gameOffView
  // )
  return getView()
}

export default GameContent
