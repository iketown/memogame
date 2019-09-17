import React, { useState } from "react"
import {
  Button,
  Grid,
  Card,
  Collapse,
  CardHeader,
  CardContent,
  IconButton
} from "@material-ui/core"
//
import { useGameCtx } from "../../../contexts/GameCtx"
import { FaCaretDown, FaCaretUp, FaPlus, FaMinus } from "react-icons/fa"
import RequestList from "./RequestList"
import MemberList from "./MemberList"
import ShowMe from "../../../utils/ShowMe.jsx"
import { useFirebase } from "../../../contexts/FirebaseCtx"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx"
import { useGameFxnsLOC } from "../../../hooks/useGameFxnsLOC"
//
//

const GameStarter = () => {
  const {
    gameState,
    createRTDBGame,
    openGameToNewPlayers,
    setGameInProgress,
    changeGameParameter
  } = useGameCtx("GameStarter")
  const { gamePlay } = useGamePlayCtx("GameStarter")
  const { pauseGame } = useGameFxnsLOC("GameStarter")
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
              <Button onClick={pauseGame}>Pause</Button>
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
