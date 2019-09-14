import React, { useEffect } from "react"
import { withSnackbar } from "notistack"
import { Card, CardHeader } from "@material-ui/core"
import moment from "moment"
//
import { useFirebase } from "../contexts/FirebaseCtx"
import AvatarMonster from "./AvatarMonster"

//
//
const SnackBarHandler = ({ gameId, enqueueSnackbar, closeSnackbar }) => {
  const { fdb } = useFirebase()

  // useEffect(() => {
  //   if (gameId) {
  //     const gameLogRef = fdb.ref(`/currentGames/${gameId}/gameLog`)
  //     gameLogRef.on("child_added", (snapshot, prevKey) => {
  //       const { uid,
  //         itemId,
  //         destination, timeStamp } = snapshot.val()
  //       const howLongAgo = Math.abs(moment(timeStamp).diff(moment(), "seconds"))
  //       if (howLongAgo < 5) {
  //         enqueueSnackbar(text, {
  //           anchorOrigin: { horizontal: "right", vertical: "bottom" },
  //           autoHideDuration: 3000,
  //           children: key => (
  //             <Card style={{ background: "white" }}>
  //               <CardHeader
  //                 style={{ padding: "5px" }}
  //                 title={text}
  //                 avatar={<AvatarMonster num={player.avatarNumber} />}
  //               />
  //             </Card>
  //           )
  //         })
  //       }
  //       // setLatestLog({ id: latestKey, ...latestObj })
  //     })
  //   }
  // }, [enqueueSnackbar, fdb, gameId])

  return <div></div>
}

export default withSnackbar(SnackBarHandler)
