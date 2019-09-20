import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import ShowMe from "../../utils/ShowMe"
import { Card, CardContent, CardHeader, Button } from "@material-ui/core"
import { useFirebase } from "../../contexts/FirebaseCtx"
import rotatingBall from "../../images/rotatingBall.gif"

const ConfirmedInvite = ({ confirmedInvites = [], history }) => {
  const invite = confirmedInvites[0]
  const { firestore, doDisInvite } = useFirebase()
  const [gameReady, setGameReady] = useState(false)
  function handleGoToGame() {
    history.push(`/game/${invite.gameId}`)
  }
  function handleCancel(inviteId) {
    doDisInvite({ inviteId })
  }

  if (invite && invite.started && !gameReady) {
    setGameReady(true)
  }

  return (
    <div>
      <Card>
        <CardHeader
          title={invite.gameName}
          subheader={`waiting for ${invite.displayName} to start`}
          action={
            <Button
              onClick={() => handleCancel(invite.inviteId)}
              variant="outlined"
              color="secondary"
            >
              CANCEL
            </Button>
          }
        />
        <div>
          {gameReady ? (
            <Button
              onClick={handleGoToGame}
              variant="contained"
              color="primary"
              fullWidth
            >
              GO TO GAME
            </Button>
          ) : (
            <img
              alt="waiting display from https://imgur.com/gallery/kv2oHwT"
              src={rotatingBall}
            />
          )}
        </div>
      </Card>
      <ShowMe obj={invite} name="invite" noModal />
    </div>
  )
}

export default withRouter(ConfirmedInvite)
