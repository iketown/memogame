import React from "react"
import { Typography, Button } from "@material-ui/core"
import styled from "styled-components"
import { withRouter } from "react-router-dom"
import { useFirebase } from "../../contexts/FirebaseCtx"
const FullPageDiv = styled.div`
  height: calc(100vh - 75px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
//
//
const GameDoesntExist = ({ history, match }) => {
  const { firestore } = useFirebase()

  function deleteInvites() {
    const gameId = match.params.gameId
    const allInvitesRef = firestore.collection("invites")
    const thisGameInvitesRef = allInvitesRef.where("gameId", "==", gameId)
    thisGameInvitesRef
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          firestore.doc(`invites/${doc.id}`).delete()
        })
      })
      .catch(err => console.error("problem deleting invites", err))
  }
  const handleExit = async () => {
    await deleteInvites()
    history.push("/gamestart")
  }
  return (
    <FullPageDiv>
      <Typography variant="body2">
        hmm. that game doesn't seem to exist.
      </Typography>
      <br />
      <Button onClick={handleExit} variant="contained" color="primary">
        Start a New Game
      </Button>
    </FullPageDiv>
  )
}

export default withRouter(GameDoesntExist)
