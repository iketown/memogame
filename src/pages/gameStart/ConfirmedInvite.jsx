import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import { Card, CardHeader, Button } from "@material-ui/core"
import { useFirebase } from "../../contexts/FirebaseCtx"
import SpinningPageLoader from "../../components/SpinningPageLoader"

const ConfirmedInvite = ({ confirmedInvites = [], history }) => {
  const invite = confirmedInvites[0]
  const { cancelInvitation } = useFirebase()
  const [gameReady, setGameReady] = useState(false)
  function handleGoToGame() {
    history.push(`/game/${invite.gameId}`)
  }
  function handleCancel(inviteId) {
    cancelInvitation({ inviteId })
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
            <div style={{ position: "relative", height: "20rem" }}>
              <SpinningPageLoader />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default withRouter(ConfirmedInvite)
