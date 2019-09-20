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
  CardHeader,
  ListSubheader
} from "@material-ui/core"
import styled from "styled-components"
import moment from "moment"
//
import ReceivedInvitesSection from "./ReceivedInvites.section.jsx"
import MyGames from "./MyGames"
import ConfirmedInvite from "./ConfirmedInvite"
import SpinningPageLoader from "../../components/SpinningPageLoader.jsx"
import ShowMe from "../../utils/ShowMe.jsx"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { usePlayersCtx } from "../../contexts/PlayersCtx"
import { useAuthCtx } from "../../contexts/AuthCtx.js"
import AvatarMonster from "../../components/AvatarMonster.jsx"
import { FaArrowRight, FaTimes, FaTimesCircle } from "react-icons/fa"
import { useFriendProfiles } from "../../hooks/Invitations/useFriendProfiles.js"
import { useInvitations } from "../../hooks/Invitations/useInvitations.js"
import {
  InvitationCtxProvider,
  useInvitationCtx
} from "../../contexts/InvitationCtx.js"
import { switchStatement } from "@babel/types"
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

const GameStartWrapper = () => {
  return (
    <InvitationCtxProvider>
      <GameStart />
    </InvitationCtxProvider>
  )
}

const GameStart = () => {
  const [gameName, setGameName] = useState("")
  const [gameNameLocked, setGameNameLocked] = useState(false)
  const [gameId, setGameId] = useState()
  const { doCreateGame, doProposeGame, doSendInvite } = useFirebase()
  const { receivedInvites } = useInvitationCtx()
  const { user, publicProfile } = useAuthCtx()

  if (!user) return <div>must sign in</div>
  const handleCancelGameName = () => {
    setGameNameLocked(false)
    setGameName("")
  }
  const handleLockGameName = () => {
    setGameNameLocked(true)
    const { avatarNumber, displayName } = publicProfile

    doProposeGame({ gameName })
      .then(({ id }) => {
        setGameId(id)
        return id
      })
      .then(id => {
        // invite yourself & confirm
        doSendInvite({
          uid: user.uid,
          avatarNumber,
          displayName,
          gameName,
          gameId: id,
          confirmed: true
        })
      })
  }
  const confirmedInvites = receivedInvites.filter(inv => inv.confirmed)
  const myGames = receivedInvites.filter(
    invite => invite.invitedBy === user.uid
  )

  function getContent() {
    switch (true) {
      case !!myGames.length: {
        return <MyGames myGames={myGames} />
      }
      case !!confirmedInvites.length: {
        return <ConfirmedInvite confirmedInvites={confirmedInvites} />
      }
      case !!receivedInvites.length: {
        return <ReceivedInvitesSection />
      }
      case gameNameLocked:
        return <InviteFriendsSection />
      case !gameNameLocked:
        return (
          <NameGameSection
            gameName={gameName}
            handleLockGameName={handleLockGameName}
            setGameName={setGameName}
            gameNameLocked={gameNameLocked}
            handleCancelGameName={handleCancelGameName}
          />
        )
      default:
        return <SpinningPageLoader />
    }
  }
  return <FullHeightGrid container>{getContent()}</FullHeightGrid>
}

const NameGameSection = ({
  gameName,
  setGameName,
  handleLockGameName,
  handleCancelGameName,
  gameNameLocked
}) => {
  return gameNameLocked ? (
    <div>
      <Typography variant="h3">{gameName}</Typography>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        onClick={() => handleCancelGameName()}
      >
        cancel
      </Button>
    </div>
  ) : (
    <Grid item xs={12}>
      <Typography variant="h4">1. Name a game</Typography>
      <TextField
        value={gameName}
        onChange={e => setGameName(e.target.value.toUpperCase())}
        label="Game Name"
      />
      <Button variant="contained" color="primary" onClick={handleLockGameName}>
        OK
      </Button>
    </Grid>
  )
}

const InviteFriendsSection = ({ gameName, gameId }) => {
  const { friendProfiles, sentInvites } = useInvitationCtx()
  const { doSendInvite, doDisInvite } = useFirebase()
  const { user, publicProfile } = useAuthCtx()

  const confirmedInvites = sentInvites.filter(inv => !!inv.confirmed)
  const unconfirmedInvites = sentInvites.filter(inv => !inv.confirmed)
  function handleInvite(uid) {
    const { displayName, avatarNumber } = publicProfile
    doSendInvite({ uid, gameName, gameId, displayName, avatarNumber })
  }

  return (
    <Grid container item xs={12}>
      <Grid xs={12}>
        <Typography variant="h4" gutterBottom>
          2. Invite friends to <b>{gameName}</b>
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
          <CardHeader title="players" />
          <List>
            <ListSubheader children="confirmed" />
            {confirmedInvites.map(invite => {
              let profile = friendProfiles.find(pf => pf.uid === invite.invited)
              if (invite.invited === user.uid) {
                profile = publicProfile
              }
              return (
                <InvitationListItem
                  key={invite.invited}
                  profile={profile}
                  invite={invite}
                />
              )
            })}
            <ListSubheader children="unconfirmed" />
            {unconfirmedInvites.map(invite => {
              const profile = friendProfiles.find(
                pf => pf.uid === invite.invited
              )
              return (
                <InvitationListItem
                  key={invite.invited}
                  profile={profile}
                  invite={invite}
                />
              )
            })}
          </List>
        </Card>
      </Grid>
    </Grid>
  )
}

const InvitationListItem = ({ profile, invite }) => {
  const { displayName, avatarNumber } = profile || {}
  const { invited: uid, inviteId, confirmed } = invite
  const { doDisInvite } = useFirebase()
  function handleDisInvite(inviteId) {
    doDisInvite(inviteId)
  }
  return (
    <ListItem>
      <ListItemAvatar>
        <AvatarMonster num={avatarNumber} />
      </ListItemAvatar>
      <ListItemText
        primary={displayName}
        secondary={confirmed ? "confirmed" : "unconfirmed"}
      />
      <ShowMe obj={invite} name="invite" />
      <ListItemSecondaryAction>
        <IconButton onClick={() => handleDisInvite(inviteId)}>
          <FaTimesCircle />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default GameStartWrapper
