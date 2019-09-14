import React from "react"
import { useGameCtx } from "../../contexts/GameCtx"
//
import ShowMe from "../../utils/ShowMe.jsx"
import { usePlayersCtx } from "../../contexts/PlayersCtx"
import {
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button
} from "@material-ui/core"
import ButtonLink from "../navigation/ButtonLink.jsx"
import { useFirebase } from "../../contexts/FirebaseCtx"
import AvatarMonster from "../AvatarMonster"
import { useAuthCtx } from "../../contexts/AuthCtx"
import { withRouter } from "react-router-dom"
import { useGamePlayCtx } from "../../contexts/GamePlayCtx"
//

const GameOver = ({ history }) => {
  const { gameState } = useGameCtx("GameOver")
  const { gamePlay } = useGamePlayCtx("GameOver")
  const { user } = useAuthCtx()
  const { players } = usePlayersCtx()
  const { doRematch } = useFirebase()
  const winner = players[gameState.winner]
  const iWon = user && gameState && user.uid === gameState.winner
  const handleRematch = () => {
    let { gameName, memberUIDs, gameId, rematchNumber } = gameState
    const newRematchNumber = rematchNumber ? rematchNumber + 1 : 1
    doRematch({
      gameName,
      memberUIDs,
      oldGameId: gameId,
      rematchNumber: newRematchNumber
    }).then(({ newLoc }) => {
      console.log("response from doRematch", newLoc)
      history.push(newLoc)
    })
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {winner && (
        <>
          <Typography variant="h5">WINNER:</Typography>
          <AvatarMonster num={winner.avatarNumber} />
          <Typography variant="h4">{winner.displayName}</Typography>
          <br></br>
          {gamePlay && gamePlay.gameStates && players && (
            <List>
              {Object.entries(gamePlay.gameStates)
                .sort((a, b) => {
                  const aPoints = a[1].points || 0
                  const bPoints = b[1].points || 0
                  console.log("comparing", aPoints, bPoints)
                  return aPoints < bPoints ? 1 : -1
                })
                .map(([id, gameState]) => {
                  console.log("id,gameState", id, gameState)
                  return (
                    <ListItem dense>
                      <ListItemAvatar>
                        <AvatarMonster
                          size="small"
                          num={players[id] && players[id].avatarNumber}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={players[id] && players[id].displayName}
                        secondary={`${(gamePlay.gameStates &&
                          gamePlay.gameStates[id].points) ||
                          0} pts`}
                      ></ListItemText>
                    </ListItem>
                  )
                })}
            </List>
          )}
          <br />
          {iWon && !gameState.rematchLoc && (
            <Button
              onClick={handleRematch}
              size="large"
              variant="contained"
              color="primary"
            >
              REMATCH
            </Button>
          )}
          {gameState.rematchLoc && (
            <div style={{ textAlign: "center" }}>
              <Typography>You're invited to a REMATCH</Typography>
              <ButtonLink
                variant="contained"
                color="primary"
                to={`/game/${gameState.rematchLoc}`}
              >
                REMATCH!!
              </ButtonLink>
            </div>
          )}
        </>
      )}
      <div>
        <ShowMe obj={gameState} name="gameState" noModal />
        <ShowMe obj={gamePlay} name="gamePlay" noModal />
        <ShowMe obj={players} name="players" noModal />
      </div>
    </div>
  )
}

export default withRouter(GameOver)
