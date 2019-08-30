import React, { useEffect, useState, useCallback } from "react"
import { withSnackbar } from "notistack"
import {
  SnackbarContent,
  Card,
  CardContent,
  CardHeader
} from "@material-ui/core"
import moment from "moment"
//
import { useLogCtx } from "../contexts/LogCtx"
import { useFirebase } from "../contexts/FirebaseCtx"
import ShowMe from "../utils/ShowMe"
import { userInfo } from "os"
import { useAuthCtx } from "../contexts/AuthCtx"
import { usePlayersCtx } from "../contexts/PlayersCtx"
import { useAllItemsCtx } from "../contexts/AllItemsCtx"
import AvatarMonster from "./AvatarMonster"

//
//
const SnackBarHandler = ({ gameId, enqueueSnackbar, closeSnackbar }) => {
  const { fdb } = useFirebase()
  const { players } = usePlayersCtx()
  const { user } = useAuthCtx()
  const { itemFromItemId } = useAllItemsCtx()
  const [latestLog, setLatestLog] = useState({})
  const handleNewLog = useCallback(
    logObj => {
      console.log("handleNewLog called", logObj)
      const { destination, itemId, text, timeStamp, uid, valid } = logObj
      const howLongAgo = Math.abs(moment(timeStamp).diff(moment(), "seconds"))
      const player = players[uid]
      const card = itemFromItemId(itemId)
      if (uid !== user.uid && howLongAgo < 10 && player && card) {
        const variant =
          destination === "house" ? "info" : valid ? "success" : "error"
        enqueueSnackbar(
          `${player.displayName} happened ${howLongAgo} seconds ago`,
          {
            variant
          }
        )
      }
    },
    [enqueueSnackbar, itemFromItemId, players, user.uid]
  )
  useEffect(() => {
    if (gameId) {
      const gameLogRef = fdb.ref(`/currentGames/${gameId}/gameLog`)
      gameLogRef.on("child_added", (snapshot, prevKey) => {
        const {
          destination,
          itemId,
          text,
          timeStamp,
          uid,
          valid,
          player
        } = snapshot.val()
        const howLongAgo = Math.abs(moment(timeStamp).diff(moment(), "seconds"))
        if (howLongAgo < 5) {
          console.log("player", player)
          enqueueSnackbar(text, {
            children: key => (
              <Card style={{ background: "white" }}>
                <CardHeader
                  style={{ padding: "5px" }}
                  title={text}
                  avatar={<AvatarMonster num={player.avatarNumber} />}
                />
              </Card>
            )
          })
        }
        // setLatestLog({ id: latestKey, ...latestObj })
      })
    }
  }, [enqueueSnackbar, fdb, gameId])

  return <div>snack bar handler</div>
}

export default withSnackbar(SnackBarHandler)
