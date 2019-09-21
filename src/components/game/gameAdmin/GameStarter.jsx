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
import { FaCaretDown, FaCaretUp } from "react-icons/fa"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx"
import { useGameFxnsLOC } from "../../../hooks/useGameFxnsLOC"
import ShowMe from "../../../utils/ShowMe.jsx"
//
//

const GameStarter = () => {
  const [expanded, setExpanded] = useState(false)
  const { gameState } = useGameCtx("GameStarter")
  const { gamePlay } = useGamePlayCtx("GameStarter")
  const { pauseGame } = useGameFxnsLOC("GameStarter")
  if (!gameState || !gamePlay) return null
  const { gameLog, ...gamePlayNoLog } = gamePlay

  function toggleExpanded() {
    setExpanded(old => !old)
  }

  //
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
              <Button onClick={pauseGame}>Pause</Button>
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center" }}>
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
