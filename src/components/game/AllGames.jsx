import React, { useState, useEffect } from "react"
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid,
  Collapse
} from "@material-ui/core"
import { FaTrash, FaThumbsUp, FaThumbsDown } from "react-icons/fa"
//
import ShowMe from "../../utils/ShowMe.jsx"
import ButtonLink from "../navigation/ButtonLink.jsx"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"

//
//
const AllGames = () => {
  const {
    doCreateGame,
    doCancelGame,
    doRequestToJoinGame,
    doExitFromGame,
    doStartGame,
    fdb,
    fsdb
  } = useFirebase()
  const { user } = useAuthCtx()
  const [availGames, setAvailGames] = useState({})
  const [gameName, setGameName] = useState("")
  useEffect(() => {
    const pendingGamesRef = fdb.ref("/pendingGames")
    pendingGamesRef.on("value", snapshot => {
      const values = snapshot.val()
      setAvailGames(values || {})
    })
  }, [fdb])
  const createThing = () => {
    fsdb.collection("things").add({ foo: "bar" })
  }
  const handleCreateGame = () => {
    doCreateGame({ gameName })
    resetFields()
  }
  const handleCancelGame = gameName => {
    doCancelGame(gameName)
  }
  const handleJoinGame = gameId => {
    console.log("gameId", gameId)
    doRequestToJoinGame(gameId)
  }
  const handleExitGame = gameId => {
    console.log("exiting game", gameId)
    doExitFromGame({ gameId })
  }

  const resetFields = () => {
    setGameName("")
  }
  if (!user) return <div>must be signed in</div>
  return (
    <Grid container spacing={2}>
      <Grid item>
        <TextField
          value={gameName}
          onChange={e => setGameName(e.target.value)}
          label="Name"
        />
      </Grid>

      <Button onClick={handleCreateGame}>Create Game</Button>
      <Grid item xs={12}>
        <List>
          {Object.entries(availGames).map(([gameId, gameObj], index) => {
            const thisIsMyGame = gameObj.startedBy === user.uid
            const iAmInThisGame = gameObj.members.find(
              mem => mem.uid === user.uid
            )
            return (
              <>
                {" "}
                <ListItem key={gameId + index}>
                  <ListItemText
                    primary={
                      <div>
                        {gameObj.gameName}{" "}
                        <ShowMe obj={gameObj} name="gameObj" />
                      </div>
                    }
                    secondary={gameObj.members.map(
                      mem => `${mem.displayName} `
                    )}
                  />

                  <ListItemSecondaryAction>
                    {thisIsMyGame ? (
                      <HostGameButtons gameId={gameId} gameObj={gameObj} />
                    ) : iAmInThisGame ? (
                      <>
                        <GoToGameButton gameId={gameId} />
                        <Button onClick={() => handleExitGame(gameId)}>
                          Exit Game
                        </Button>
                      </>
                    ) : gameObj.inProgress ? (
                      <div>sol buddy</div>
                    ) : (
                      <Button onClick={() => handleJoinGame(gameId)}>
                        Join
                      </Button>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                {thisIsMyGame && (
                  <MemberRequestsDisplay gameId={gameId} gameObj={gameObj} />
                )}
              </>
            )
          })}
        </List>
      </Grid>
    </Grid>
  )
}
const MemberRequestsDisplay = ({ gameId, gameObj }) => {
  const { memberRequests = [] } = gameObj
  const { doHandleGameRequest } = useFirebase()
  const handleApproved = uid => {
    doHandleGameRequest({ gameId, uid, approved: true })
  }
  const handleDenied = uid => {
    doHandleGameRequest({ gameId, uid, approved: false })
  }
  return (
    <Collapse in={memberRequests && memberRequests.length}>
      <List dense>
        {memberRequests.map(req => (
          <ListItem dense>
            <ListItemText
              primary={req.displayName}
              secondary="requests to join"
            />
            <ListItemSecondaryAction>
              <Button color="primary" onClick={() => handleApproved(req.uid)}>
                Approve
                <FaThumbsUp style={{ marginLeft: "5px" }} />
              </Button>
              <Button color="secondary" onClick={() => handleDenied(req.uid)}>
                Deny
                <FaThumbsDown style={{ marginLeft: "5px" }} />
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Collapse>
  )
}

const HostGameButtons = ({ gameId, gameObj }) => {
  const { doStartGame, doCancelGame } = useFirebase()
  const handleCancelGame = gameName => {
    doCancelGame(gameName)
  }
  return (
    <>
      {gameObj.members.length > 1 && <GoToGameButton gameId={gameId} />}
      <IconButton onClick={() => handleCancelGame(gameId)}>
        <FaTrash />
      </IconButton>
    </>
  )
}

const GoToGameButton = ({ gameId }) => {
  return <ButtonLink to={`/game/${gameId}`}>Go To Game</ButtonLink>
}

export default AllGames
