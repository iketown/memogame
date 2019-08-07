import React, { useEffect, useState } from "react"
import {
  Button,
  Grid,
  List,
  Card,
  CardContent,
  CardHeader,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core"
import { FaUser, FaThumbsUp, FaThumbsDown } from "react-icons/fa"
//
import { useFirebase } from "../contexts/FirebaseCtx"
import ShowMe from "../utils/ShowMe.jsx"
import { useAuthCtx } from "../contexts/AuthCtx"
import { useFirestore } from "../contexts/FirestoreCtx"
import { GameCtxProvider, useGameCtx } from "../contexts/GameCtx"
//
//
const Game = props => {
  console.log("props", props)
  const { firestore, requestJoinGame } = useFirestore()
  const { user, displayName } = useAuthCtx()
  const [gameState, setGameState] = useState({})
  const { gameId } = props.match.params
  useEffect(() => {
    const gameRef = firestore.doc(`/games/${gameId}`)
    gameRef.onSnapshot(doc => {
      const values = doc.data()
      console.log("values", values)
      setGameState(values)
    })
  }, [firestore, gameId])
  const members = gameState && gameState.members
  if (!user) return <div>must sign in</div>
  if (!members) return <div>no members</div>
  if (!gameId) return <div>no game id</div>

  const gameMemberView = (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        Game Room {gameId}
      </Grid>
      <Grid item xs={12}>
        {gameState.startedBy === user.uid && gameState.memberRequests && (
          <RequestList requests={gameState.memberRequests} />
        )}
      </Grid>

      <ShowMe obj={gameState} name="gameState" noModal />
    </Grid>
  )
  const nonGameMemberView = <YoureNotInThisGameYet />

  const youAreAMember = members.find(mem => mem.uid === user.uid)

  return (
    <GameCtxProvider gameId={gameId}>
      {youAreAMember ? gameMemberView : nonGameMemberView}
    </GameCtxProvider>
  )
}

export default Game

const YoureNotInThisGameYet = ({ gameId }) => {
  const { gameState, requestJoinGame, removeRequest } = useGameCtx()
  const { user } = useAuthCtx()
  const alreadyRequestedThisGame =
    gameState.memberRequests &&
    gameState.memberRequests.find(req => req.uid === user.uid)
  if (alreadyRequestedThisGame) {
    return (
      <div>
        your request is pending...
        <Button onClick={removeRequest}>remove request</Button>
      </div>
    )
  }
  return (
    <div>
      you're not in this game.{" "}
      <Button onClick={() => requestJoinGame(gameId)}>request to join</Button>
    </div>
  )
}

const RequestList = ({ requests }) => {
  if (!requests || !requests.length) return null
  return (
    <Card>
      <CardHeader title="Player requests" />
      <CardContent>
        <List dense>
          {requests.map(req => (
            <RequestToJoin request={req} key={req.uid} />
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

const RequestToJoin = ({ request }) => {
  const { handleGameRequest } = useGameCtx()
  const requestingUID = request.uid
  function handleAccept() {
    handleGameRequest({ requestingUID, approvedBool: true })
  }
  function handleDeny() {
    handleGameRequest({ requestingUID, approvedBool: false })
  }
  return (
    <ListItem dense>
      <ListItemAvatar>
        <Avatar>
          <FaUser />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={request.displayName}
        secondary="requests to join game"
      />
      <ListItemSecondaryAction>
        <IconButton onClick={handleAccept} color="primary">
          <FaThumbsUp />
        </IconButton>
        <IconButton onClick={handleDeny} color="secondary">
          <FaThumbsDown />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
