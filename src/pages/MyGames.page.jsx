import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useFirebase } from "../contexts/FirebaseCtx"
import { useAuthCtx } from "../contexts/AuthCtx"
import ShowMe from "../utils/ShowMe"
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core"
import { FaForward, FaArrowRight } from "react-icons/fa"

const brianUid = "ljXT8umqmAW0pS9GpVKhXyGmC422"

const MyGamesPage = () => {
  const { user } = useAuthCtx()
  const [myGames, setMyGames] = useState([])
  console.log("uid", user && user.uid)
  const { firestore } = useFirebase()
  useEffect(() => {
    const myGamesRef = firestore
      .collection(`games`)
      .where("memberUIDs", "array-contains", brianUid)
    myGamesRef
      .get()
      .then(querySnapshot => {
        const _myGames = []
        querySnapshot.forEach(doc => {
          _myGames.push({ id: doc.id, ...doc.data() })
          console.log("my game", doc.id, doc.data())
        })
        setMyGames(_myGames)
      })
      .catch(err => console.log("error getting docs", err))
  }, [firestore])
  return (
    <div>
      my games
      <List>
        {myGames.map(game => (
          <GameListItem key={game.id} game={game} />
        ))}
      </List>
      <ShowMe obj={myGames} name="myGames" noModal />
    </div>
  )
}

export default MyGamesPage

const GameListItem = ({ game }) => {
  return (
    <ListItem>
      <ListItemText
        primary={game.gameName}
        secondary={game.members.map(mem => mem.displayName)}
      />
      <ListItemSecondaryAction>
        <Link to={`/game/${game.id}`}>
          <IconButton>
            <FaArrowRight />
          </IconButton>
        </Link>
      </ListItemSecondaryAction>
    </ListItem>
  )
}
