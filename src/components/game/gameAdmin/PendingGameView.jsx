import React from "react"
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  CardActions,
  Button
} from "@material-ui/core"
import styled from "styled-components"
import { FaThumbsUp } from "react-icons/fa"
//
import AvatarMonster from "../../AvatarMonster.jsx"
import { useGameCtx } from "../../../contexts/GameCtx.js"
import { usePlayersCtx } from "../../../contexts/PlayersCtx.js"
import { useAuthCtx } from "../../../contexts/AuthCtx.js"

//
//

const PlayerSection = styled(Card)`
  margin-bottom: 1rem;
  padding: 10px 0 0 10px;
  opacity: ${p => (p.empty ? 0.5 : 1)};
`
const PlayerChipContainer = styled(CardContent)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`
const PendingGameView = () => {
  const {
    gameState,
    handleGameRequest,
    removeFromGame,
    createRTDBGame,
    setGameInProgress
  } = useGameCtx("PendingGameView")
  const { user } = useAuthCtx()
  const myGame = user && gameState && user.uid === gameState.startedBy
  const noRequests =
    gameState.memberRequests && gameState.memberRequests.length === 0
  function handleStartGame() {
    createRTDBGame()
    setGameInProgress()
  }
  return (
    <div>
      <Card>
        <CardContent>
          <PlayerSection>
            <Typography variant="subtitle2">Players:</Typography>
            <PlayerChipContainer>
              {gameState.memberUIDs.map(uid => (
                <PlayerChip
                  key={uid}
                  uid={uid}
                  inGame
                  handleClick={
                    myGame
                      ? () => {
                          removeFromGame({ uid })
                        }
                      : false
                  }
                />
              ))}
            </PlayerChipContainer>
          </PlayerSection>
          <PlayerSection empty={noRequests}>
            <Typography variant="subtitle2">Requests to Join:</Typography>
            {!noRequests && (
              <PlayerChipContainer>
                {gameState.memberRequests &&
                  gameState.memberRequests.map(uid => (
                    <PlayerChip
                      key={uid}
                      uid={uid}
                      handleClick={
                        myGame
                          ? () => {
                              handleGameRequest({
                                requestingUID: uid,
                                approvedBool: true
                              })
                            }
                          : false
                      }
                    />
                  ))}
              </PlayerChipContainer>
            )}
          </PlayerSection>
          {myGame && (
            <CardActions>
              <Button
                onClick={handleStartGame}
                fullWidth
                size="large"
                variant="contained"
                color="primary"
              >
                START GAME
              </Button>
            </CardActions>
          )}
        </CardContent>
      </Card>
      {/* <ShowMe obj={gameState} name="gameState" noModal />
      <ShowMe obj={players} name="players" noModal /> */}
    </div>
  )
}

export default PendingGameView

const PlayerChip = ({ uid, inGame, handleClick }) => {
  const { players } = usePlayersCtx()
  const { user } = useAuthCtx()
  const isMe = uid === user.uid // cant kick yourself out of the game
  if (!players || !players[uid]) return <div>?</div>
  const { avatarNumber, displayName, email } = players[uid]
  return (
    <Chip
      style={{ margin: "5px" }}
      avatar={<AvatarMonster num={avatarNumber} size="small" />}
      label={displayName || email}
      variant={"outlined"}
      onClick={!inGame ? handleClick : () => null}
      onDelete={isMe ? false : handleClick}
      deleteIcon={
        !inGame ? (
          <IconButton size="small">
            <FaThumbsUp />
          </IconButton>
        ) : (
          false
        )
      }
    />
  )
}
