import React, { useState, useEffect } from "react"
import {
  Grid,
  TextField,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardHeader
} from "@material-ui/core"
import styled from "styled-components"
import moment from "moment"
//
import ShowMe from "../utils/ShowMe.jsx"
import { useFirebase } from "../contexts/FirebaseCtx"
import { usePlayersCtx } from "../contexts/PlayersCtx"
import { useAuthCtx } from "../contexts/AuthCtx.js"
import AvatarMonster from "../components/AvatarMonster.jsx"
import { FaArrowRight, FaTimes, FaTimesCircle } from "react-icons/fa"
//
//
const FullHeightGrid = styled(Grid)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const GameStart = ({ history }) => {
  window.moment = moment
  const [gameName, setGameName] = useState("")
  const [friends, setFriends] = useState([])
  const [friendProfiles, setFriendProfiles] = useState([])
  const [sentInvites, setSentInvites] = useState([])
  const [receivedInvites, setReceivedInvites] = useState([])
  const { doCreateGame, firestore, doSendInvite, doDisInvite } = useFirebase()
  const { user } = useAuthCtx()

  function handleInvite(uid) {
    doSendInvite({ uid, gameName })
  }
  function handleDisInvite(inviteId) {
    doDisInvite(inviteId)
  }
  useEffect(() => {
    // get friends uids
    if (user) {
      const profileRef = firestore.doc(`publicProfiles/${user.uid}`)
      async function getFriends() {
        const { friends = [] } = await profileRef.get().then(doc => doc.data())
        setFriends(friends)
      }
      getFriends()
    }
  }, [firestore, user])
  useEffect(() => {
    // get profiles of friends
    if (friends && friends.length) {
      const promises = friends.map(friendUid => {
        const memberRef = firestore.collection("publicProfiles").doc(friendUid)
        return memberRef.get().then(doc => {
          return { ...doc.data(), uid: doc.id }
        })
      })
      Promise.all(promises).then(docs => setFriendProfiles(docs))
    }
  }, [firestore, friends])
  useEffect(() => {
    if (user) {
      const myInvites = firestore
        .collection("invites")
        .where("invitedBy", "==", user.uid)
      myInvites.onSnapshot(snapshot => {
        const _sent = []
        snapshot.forEach(doc => _sent.push({ ...doc.data(), inviteId: doc.id }))
        setSentInvites(_sent)
      })
    }
  }, [firestore, user])
  const handleCreateGame = () => {
    doCreateGame({ gameName })
      .then(({ id }) => {
        history.push(`/game/${id}`)
      })
      .catch(err => console.log("error in handleCreateGame", err))
  }
  return (
    <FullHeightGrid container>
      <Grid item xs={12}>
        <Typography variant="h4">1. Name a game</Typography>
        <TextField
          value={gameName}
          onChange={e => setGameName(e.target.value)}
          label="Game Name"
        />
      </Grid>
      <Grid container item xs={12}>
        <Grid xs={12}>
          <Typography variant="h4" gutterBottom>
            2. Invite friends
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="friends" />
            <List>
              {friendProfiles.map(
                ({ avatarNumber, displayName, email, uid }, index) => {
                  const alreadyInvited = !!sentInvites.find(
                    inv => inv.invited === uid
                  )
                  return (
                    <ListItem>
                      <ListItemAvatar>
                        <AvatarMonster num={avatarNumber} />
                      </ListItemAvatar>
                      <ListItemText primary={displayName} />
                      <ListItemSecondaryAction>
                        <Button
                          disabled={alreadyInvited}
                          onClick={() => handleInvite(uid)}
                        >
                          {alreadyInvited ? ":)" : "invite"}
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                }
              )}
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="sent invitations" />
            <List>
              {sentInvites.map(({ invited: uid, inviteId }) => {
                const profile = friendProfiles.find(pf => pf.uid === uid)
                const { displayName, avatarNumber } = profile || {}
                return (
                  <ListItem>
                    <ListItemAvatar>
                      <AvatarMonster num={avatarNumber} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={displayName}
                      secondary={"unconfirmed"}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleDisInvite(inviteId)}>
                        <FaTimesCircle />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              })}
            </List>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          3. Start it up
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          disabled={!gameName}
          onClick={handleCreateGame}
        >
          Go
        </Button>
      </Grid>
      <Grid item xs={12}>
        {/* <ShowMe obj={friends} name="friends" noModal />
        <ShowMe obj={friendProfiles} name="friendProfiles" noModal />
        <ShowMe obj={user} name="user" noModal /> */}
      </Grid>
    </FullHeightGrid>
  )
}

export default GameStart

const InviteFriends = () => {}
