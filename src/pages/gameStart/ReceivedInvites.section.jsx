import React from "react"
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CardContent,
  ListSubheader,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  Tooltip
} from "@material-ui/core"
import moment from "moment"
//
import { useFirebase } from "../../contexts/FirebaseCtx"
import { FriendListItem, InvitationListItem } from "./ListItems"
import { useInvitationCtx } from "../../contexts/InvitationCtx"
import AvatarMonster from "../../components/AvatarMonster.jsx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import ShowMe from "../../utils/ShowMe"
import { FaTimesCircle, FaThumbsUp, FaThumbsDown } from "react-icons/fa"

//
//

const ReceivedInvitesSection = ({ gameName, gameId }) => {
  const { firestore, doSendInvite, doDisInvite, doAcceptInvite } = useFirebase()
  const { receivedInvites } = useInvitationCtx()
  const { user, publicProfile } = useAuthCtx()

  function handleInvite(uid) {
    const { displayName, avatarNumber } = publicProfile
    doSendInvite({ uid, gameName, gameId, displayName, avatarNumber })
  }
  function handleReject(inviteId) {
    doDisInvite({ inviteId })
  }
  function handleAccept(inviteId) {
    doAcceptInvite({ inviteId })
  }

  const myGames = receivedInvites.filter(
    invite => invite.invitedBy === user.uid
  )
  // first handle YOUR games.  (either start or cancel them)
  if (!!myGames.length) return <MyGameSection myGames={myGames} />

  // if you havent started any games, show list of invitations:
  return (
    <Card style={{ minWidth: "25rem" }}>
      <CardHeader title="You're Invited:" />
      <List>
        {receivedInvites.map(inv => {
          return (
            <ListItem key={inv.inviteId}>
              <ListItemAvatar>
                <AvatarMonster num={inv.avatarNumber} />
              </ListItemAvatar>
              <ListItemText
                primary={inv.gameName}
                secondary={
                  <span>
                    invited by <b>{inv.displayName}</b>
                  </span>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => handleAccept(inv.inviteId)}
                  color="primary"
                >
                  <FaThumbsUp />
                </IconButton>
                <IconButton
                  onClick={() => handleReject(inv.inviteId)}
                  color="secondary"
                >
                  <FaThumbsDown />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )
        })}
      </List>
    </Card>
  )
}

const MyGameSection = ({ myGames }) => {
  // you can't join another game if you're hosting a game.
  // following one of the other invites means cancelling this one.
  const { user, publicProfile } = useAuthCtx()
  const game = myGames[0]
  const {
    avatarNumber,
    confirmed,
    displayName,
    gameId,
    gameName,
    inviteId,
    timeStamp
  } = game
  const { friendProfiles, sentInvites } = useInvitationCtx()
  const { doSendInvite, doDisInvite } = useFirebase()

  function handleSendInvite({ uid }) {
    doSendInvite({ uid, displayName, avatarNumber, gameName, gameId })
  }
  const uninvitedFriends = friendProfiles.filter(
    friend => !sentInvites.find(inv => inv.invited === friend.uid)
  )
  function handleCancelGame() {
    const promises = sentInvites.map(({ inviteId }) =>
      doDisInvite({ inviteId })
    )
    Promise.all(promises).then(responses => {
      console.log("responses", responses)
    })
  }
  return (
    <Card style={{ minWidth: "20rem" }}>
      <CardHeader
        title={gameName}
        subheader={moment(timeStamp).fromNow()}
        action={<Button onClick={handleCancelGame}>cancel</Button>}
      />
      <ShowMe obj={game} name="game" />
      <CardContent>
        <List dense>
          <Divider />
          <ListSubheader>confirmed</ListSubheader>
          {sentInvites
            .filter(inv => inv.confirmed)
            .map(invite => {
              const thisIsMe = invite.invited === user.uid
              return (
                <InvitationListItem
                  key={invite.invited}
                  invite={invite}
                  profile={
                    thisIsMe
                      ? publicProfile
                      : friendProfiles.find(({ uid }) => uid === invite.invited)
                  }
                  thisIsMe={thisIsMe}
                />
              )
            })}

          <Divider />
          <ListSubheader>invited (unconfirmed)</ListSubheader>
          {sentInvites
            .filter(invite => !invite.confirmed)
            .map(invite => {
              const thisIsMe = invite.invited === user.uid
              return (
                <InvitationListItem
                  key={invite.invited}
                  invite={invite}
                  profile={
                    thisIsMe
                      ? publicProfile
                      : friendProfiles.find(({ uid }) => uid === invite.invited)
                  }
                  thisIsMe={thisIsMe}
                />
              )
            })}
          <Divider />
          <ListSubheader>friends</ListSubheader>
          {uninvitedFriends.map(profile => {
            return (
              <FriendListItem
                key={profile.uid}
                profile={profile}
                handleSendInvite={handleSendInvite}
              />
            )
          })}
          <ShowMe obj={uninvitedFriends} name="uninvitedFriends" />
        </List>
      </CardContent>
    </Card>
  )
}

export default ReceivedInvitesSection
