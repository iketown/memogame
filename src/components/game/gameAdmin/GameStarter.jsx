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
import { FaUser, FaCaretDown, FaCaretUp, FaPlus, FaMinus } from "react-icons/fa"
import RequestList from "./RequestList"
import MemberList from "./MemberList"
import ShowMe from "../../../utils/ShowMe.jsx"
import { useFirebase } from "../../../contexts/FirebaseCtx"
import SpinningPageLoader from "../../SpinningPageLoader"
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
    setGameInProgress,
    changeGameParameter
  } = useGameCtx()
  const { handleWinGame } = useFirebase()
  const [expanded, setExpanded] = useState(false)
  if (!gameState || !gamePlay) return null
  const { gameLog, ...gamePlayNoLog } = gamePlay
  function handleStartGame() {
    createRTDBGame()
    setGameInProgress()
    setExpanded(false)
  }
  function toggleExpanded() {
    setExpanded(old => !old)
  }
  const changeSecondsPerTurn = delta => () => {
    const current = (gameState && gameState.secondsPerTurn) || 15
    changeGameParameter({ key: "secondsPerTurn", value: current + delta })
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
            <Grid item xs={12}>
              <MemberList members={gameState.members} />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={() => handleWinGame({ gameId: gameState.gameId })}
              >
                Cheat WIN
              </Button>
            </Grid>
            {gameState.memberRequests && gameState.memberRequests.length ? (
              <Grid item xs={12}>
                <RequestList requests={gameState.memberRequests} />
              </Grid>
            ) : (
              ""
            )}
            <Grid item xs={12}>
              <div>
                sec per turn: {gameState && gameState.secondsPerTurn}{" "}
                <IconButton onClick={changeSecondsPerTurn(1)}>
                  <FaPlus />
                </IconButton>
                <IconButton onClick={changeSecondsPerTurn(-1)}>
                  <FaMinus />
                </IconButton>
              </div>
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

              <ShowMe obj={gamePlayNoLog} name="gamePlayNoLog" />
              <ShowMe obj={gameState} name="gameState" />
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default GameStarter
