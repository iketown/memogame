import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useFirebase } from "../contexts/FirebaseCtx"
import { useAuthCtx } from "../contexts/AuthCtx"
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core"
import { FaArrowRight, FaTimes } from "react-icons/fa"

const MyGamesPage = () => {
  const { user } = useAuthCtx()
  const [myGames, setMyGames] = useState([])
  const { firestore } = useFirebase()
  useEffect(() => {
    if (user && user.uid) {
      const myGamesRef = firestore
        .collection(`games`)
        .where("memberUIDs", "array-contains", user.uid)
      myGamesRef.onSnapshot(querySnapshot => {
        const _myGames = []
        querySnapshot.forEach(doc => {
          _myGames.push({ id: doc.id, ...doc.data() })
        })
        setMyGames(_myGames)
      })
    }
  }, [firestore, user])
  return (
    <div>
      my games
      <List>
        {myGames.map(game => (
          <GameListItem key={game.id} game={game} />
        ))}
      </List>
    </div>
  )
}

export default MyGamesPage

const GameListItem = ({ game }) => {
  const { user } = useAuthCtx()
  const { deleteGame } = useFirebase()
  const myGame = user && game.startedBy === user.uid
  return (
    <ListItem>
      <ListItemText
        primary={game.gameName}
        secondary={game.inProgress && "in progress"}
      />
      <ListItemSecondaryAction>
        {myGame && (
          <IconButton onClick={() => deleteGame({ gameId: game.id })}>
            <FaTimes />
          </IconButton>
        )}
        <Link to={`/game/${game.id}`}>
          <IconButton>
            <FaArrowRight />
          </IconButton>
        </Link>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
