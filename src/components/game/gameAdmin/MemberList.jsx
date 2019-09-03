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
import { usePlayersCtx } from "../../../contexts/PlayersCtx"
//
//
//
const MemberList = ({ members }) => {
  const { players } = usePlayersCtx()
  console.log("players", players)
  return (
    <Card>
      <CardHeader title="Players" />
      <CardContent>
        <List dense>
          {Object.entries(players).map(([uid, mem]) => (
            <ListItem key={uid} dense>
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
