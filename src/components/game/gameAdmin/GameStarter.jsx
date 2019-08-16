import React, { useState } from "react"
import {
  Button,
  Grid,
  Card,
  Collapse,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton
} from "@material-ui/core"
import styled from "styled-components"
//
import { useGameCtx } from "../../../contexts/GameCtx"
import { FaUser, FaCaretDown, FaCaretUp } from "react-icons/fa"
import RequestList from "./RequestList"
import MemberList from "./MemberList"
import ShowMe from "../../../utils/ShowMe.jsx"
//
//
const StyledDiv = styled.div`
  border: 1px solid green;
`
const GameStarter = () => {
  const {
    gameState,
    gamePlay,
    createRTDBGame,
    openGameToNewPlayers,
    setGameInProgress
  } = useGameCtx()
  const [expanded, setExpanded] = useState(false)

  function handleStartGame() {
    createRTDBGame()
    setGameInProgress()
    setExpanded(false)
  }
  function toggleExpanded() {
    setExpanded(old => !old)
  }
  //
  const gameIsInProgress = gameState && gameState.inProgress
  return (
    <Card>
      <CardHeader
        subheader="manage members"
        action={
          <IconButton onClick={toggleExpanded}>
            {expanded ? <FaCaretDown /> : <FaCaretUp />}
          </IconButton>
        }
      />
      <Collapse in={expanded}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <MemberList members={gameState.members} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RequestList requests={gameState.memberRequests} />
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              {gameIsInProgress ? (
                <>
                  <Button size="large" variant="contained" color="primary">
                    Restart with same players
                  </Button>
                  <Button onClick={openGameToNewPlayers} variant="outlined">
                    change players
                  </Button>
                </>
              ) : (
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={handleStartGame}
                >
                  Start Game
                </Button>
              )}
              <ShowMe obj={gamePlay} name="gamePlay" />
              <ShowMe obj={gameState} name="gameState" />
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default GameStarter
