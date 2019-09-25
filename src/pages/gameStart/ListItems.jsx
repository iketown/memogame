import React from "react"
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Tooltip
} from "@material-ui/core"
//
import { useFirebase } from "../../contexts/FirebaseCtx"
import AvatarMonster from "../../components/AvatarMonster.jsx"
import { FaTimesCircle } from "react-icons/fa"
import { usePublicProfile } from "../../hooks/Invitations/usePublicProfile"

//
//

export const FriendListItem = ({
  handleSendInvite,
  friendUid,
  disabled = false
}) => {
  const profile = usePublicProfile(friendUid)
  const { avatarNumber, displayName } = profile
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
          onClick={() => handleSendInvite({ uid: friendUid })}
          disabled={disabled}
        >
          {disabled ? "invited already" : "INVITE"}
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export const InvitationListItem = ({ invite, thisIsMe }) => {
  const profile = usePublicProfile(invite.invited)
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
