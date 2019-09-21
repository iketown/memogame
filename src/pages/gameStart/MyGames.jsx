import React from "react"
import {
  Card,
  CardHeader,
  List,
  CardContent,
  ListSubheader,
  Button,
  Divider,
  CardActions,
  CardActionArea
} from "@material-ui/core"
import { withRouter } from "react-router-dom"
import moment from "moment"
//
import { InvitationListItem, FriendListItem } from "./ListItems.jsx"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { useInvitationCtx } from "../../contexts/InvitationCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import ShowMe from "../../utils/ShowMe"
import { useDialogCtx } from "../../contexts/DialogCtx.js"

export const MyGameSection = ({
  myGames = [],
  handleCancelGameName,
  history
}) => {
  // you can't join another game if you're hosting a game.
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
  const {
    doSendInvite,
    doDisInvite,
    convertInviteToGame,
    doCreateGameFromInvites
  } = useFirebase()
  const { dispatch } = useDialogCtx()
  function handleSendInvite({ uid }) {
    doSendInvite({ uid, displayName, avatarNumber, gameName, gameId })
  }
  const uninvitedFriends = friendProfiles.filter(
    friend => !sentInvites.find(inv => inv.invited === friend.uid)
  )
  const confirmedInvites = sentInvites.filter(inv => inv.confirmed)
  const unconfirmedInvites = sentInvites.filter(inv => !inv.confirmed)
  function handleCancelGame() {
    const promises = sentInvites.map(({ inviteId }) =>
      doDisInvite({ inviteId })
    )
    Promise.all(promises).then(responses => {
      console.log("responses", responses)
    })
    handleCancelGameName()
  }
  async function handleStartGame() {
    const promises = confirmedInvites.map(({ inviteId }) => {
      return convertInviteToGame({ inviteId }) // update started: true
    })
    await Promise.all(promises)
    const memberUIDs = sentInvites.map(({ invited }) => invited)
    const responses = await doCreateGameFromInvites({
      memberUIDs,
      gameId,
      gameName
    })
    console.log("responses handleStartGame", responses)
    // remove unconfirmed invitations
    cancelUnconfirmedInvites()
    history.push(`/game/${gameId}`)
  }
  function cancelUnconfirmedInvites() {
    const promises = unconfirmedInvites.map(({ inviteId }) =>
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
      <CardContent>
        <Button
          onClick={() => handleStartGame()}
          fullWidth
          variant="contained"
          color="primary"
        >
          START {confirmedInvites.length} player game
        </Button>
        <List dense>
          <Divider />
          <ListSubheader>confirmed</ListSubheader>
          {confirmedInvites.map(invite => {
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
          {unconfirmedInvites.map(invite => {
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
        </List>
      </CardContent>
      <CardActions>
        <Button
          onClick={() =>
            dispatch({
              formType: "searchPlayers",
              type: "OPEN_FORM",
              gameId,
              gameName,
              sentInvites
            })
          }
        >
          Search Players
        </Button>
      </CardActions>
    </Card>
  )
}

export default withRouter(MyGameSection)
