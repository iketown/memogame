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
import { useInvitationCtx } from "../../contexts/InvitationCtx"
import AvatarMonster from "../../components/AvatarMonster.jsx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import ShowMe from "../../utils/ShowMe"
import { FaTimesCircle, FaThumbsUp, FaThumbsDown } from "react-icons/fa"

export const FriendListItem = ({
  profile,
  handleSendInvite,
  disabled = false
}) => {
  const { avatarNumber, displayName, email, uid } = profile
  return (
    <ListItem dense>
      <ListItemAvatar>
        <AvatarMonster num={avatarNumber} />
      </ListItemAvatar>
      <ListItemText primary={displayName} />
      <ListItemSecondaryAction>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleSendInvite({ uid })}
          disabled={disabled}
        >
          {disabled ? "invited already" : "INVITE"}
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export const InvitationListItem = ({ profile, invite, thisIsMe }) => {
  const { displayName, avatarNumber } = profile || {}
  const { invited: uid, inviteId, confirmed } = invite
  const { cancelInvitation } = useFirebase()

  function handleDisInvite(inviteId) {
    cancelInvitation({ inviteId, uid })
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
      {!thisIsMe && (
        <ListItemSecondaryAction>
          <Tooltip title={`uninvite ${displayName} ?`}>
            <IconButton onClick={() => handleDisInvite(inviteId)}>
              <FaTimesCircle />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  )
}
