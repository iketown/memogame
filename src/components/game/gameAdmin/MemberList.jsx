import React from "react"
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core"
import { FaUser } from "react-icons/fa"
//
//
//
const MemberList = ({ members }) => {
  return (
    <Card>
      <CardHeader title="Players" />
      <CardContent>
        <List dense>
          {members.map(mem => (
            <ListItem key={mem.uid} dense>
              <ListItemAvatar>
                <FaUser />
              </ListItemAvatar>
              <ListItemText primary={mem.displayName} secondary="in game" />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default MemberList
