import React from "react"
import {
  Card,
  CardHeader,
  List,
  CardContent,
  ListSubheader,
  Button,
  Divider,
  CardActions
} from "@material-ui/core"
import { withRouter } from "react-router-dom"
import moment from "moment"
//
import { InvitationListItem, FriendListItem } from "./ListItems.jsx"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { useInvitationCtx } from "../../contexts/InvitationCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import { useDialogCtx } from "../../contexts/DialogCtx.js"

export const MyGameSection = ({
  myGames = [],
  handleCancelGameName,
  history
}) => {
  // you can't join another game if you're hosting a game.
  const { user, publicProfile } = useAuthCtx()
  const game = myGames[0]
  const { avatarNumber, displayName, gameId, gameName, timeStamp } = game
  const { sentInvites } = useInvitationCtx()
  const {
    doSendInvite,
    cancelInvitation,
    convertInviteToGame,
    createGameFromInvites
  } = useFirebase()
  const { dispatch } = useDialogCtx()
  function handleSendInvite({ uid }) {
    doSendInvite({ uid, displayName, avatarNumber, gameName, gameId })
  }
  const uninvitedFriends =
    (publicProfile &&
      publicProfile.friends &&
      publicProfile.friends.filter(
        friendUid => !sentInvites.find(inv => inv.invited === friendUid)
      )) ||
    []
  const confirmedInvites = sentInvites.filter(inv => inv.confirmed)
  const unconfirmedInvites = sentInvites.filter(inv => !inv.confirmed)
  async function handleCancelGame() {
    const promises = sentInvites.map(({ inviteId }) =>
      cancelInvitation({ inviteId })
    )
    await Promise.all(promises)
    handleCancelGameName()
  }
  async function handleStartGame() {
    const promises = confirmedInvites.map(({ inviteId }) => {
      return convertInviteToGame({ inviteId }) // update started: true
    })
    await Promise.all(promises)
    const memberUIDs = sentInvites.map(({ invited }) => invited)
    await createGameFromInvites({
      memberUIDs,
      gameId,
      gameName
    })
    // remove unconfirmed invitations
    cancelUnconfirmedInvites()
    history.push(`/game/${gameId}`)
  }
  async function cancelUnconfirmedInvites() {
    const promises = unconfirmedInvites.map(({ inviteId }) =>
      cancelInvitation({ inviteId })
    )
    await Promise.all(promises)
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
                key={invite.inviteId}
                invite={invite}
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
                thisIsMe={thisIsMe}
              />
            )
          })}
          <Divider />
          <ListSubheader>friends</ListSubheader>
          {uninvitedFriends.map(uid => {
            return (
              <FriendListItem
                friendUid={uid}
                key={uid}
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
