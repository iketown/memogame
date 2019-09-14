import React from "react"
import {
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
import { useGameCtx } from "../../../contexts/GameCtx"
//
//
const RequestList = ({ requests = [] }) => {
  return (
    <Card>
      <CardHeader title="Player requests" />
      <CardContent>
        <List dense>
          {requests.length === 0 && (
            <ListItem>
              <ListItemText primary="none" />
            </ListItem>
          )}
          {!!requests.length &&
            requests.map(req => <RequestToJoin request={req} key={req.uid} />)}
        </List>
      </CardContent>
    </Card>
  )
}

const RequestToJoin = ({ request }) => {
  const { handleGameRequest } = useGameCtx('RequestToJoin')
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

export default RequestList
