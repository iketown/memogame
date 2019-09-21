import React, { useState, useEffect } from "react"
import {
  Grid,
  TextField,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardHeader,
  ListSubheader
} from "@material-ui/core"
import styled from "styled-components"
import moment from "moment"
//
import ReceivedInvitesSection from "./ReceivedInvites.section.jsx"
import MyGames from "./MyGames"
import ConfirmedInvite from "./ConfirmedInvite"
import SpinningPageLoader from "../../components/SpinningPageLoader.jsx"
import ShowMe from "../../utils/ShowMe.jsx"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { usePlayersCtx } from "../../contexts/PlayersCtx"
import { useAuthCtx } from "../../contexts/AuthCtx.js"
import AvatarMonster from "../../components/AvatarMonster.jsx"
import { FaArrowRight, FaTimes, FaTimesCircle } from "react-icons/fa"
import { useFriendProfiles } from "../../hooks/Invitations/useFriendProfiles.js"
import { useInvitations } from "../../hooks/Invitations/useInvitations.js"
import {
  InvitationCtxProvider,
  useInvitationCtx
} from "../../contexts/InvitationCtx.js"
import { switchStatement } from "@babel/types"
//
//
const FullHeightGrid = styled(Grid)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const GameStartWrapper = () => {
  return (
    <InvitationCtxProvider>
      <GameStart />
    </InvitationCtxProvider>
  )
}

const GameStart = () => {
  const [gameName, setGameName] = useState("")
  const [gameNameLocked, setGameNameLocked] = useState(false)
  const [gameId, setGameId] = useState()
  const { doCreateGame, proposeGame, doSendInvite } = useFirebase()
  const { receivedInvites } = useInvitationCtx()
  const { user, publicProfile } = useAuthCtx()

  if (!user) return <div>must sign in</div>
  const handleCancelGameName = () => {
    setGameNameLocked(false)
    setGameName("")
  }
  const handleLockGameName = () => {
    setGameNameLocked(true)
    const { avatarNumber, displayName } = publicProfile

    proposeGame({ gameName })
      .then(({ id }) => {
        setGameId(id)
        return id
      })
      .then(id => {
        // invite yourself & confirm
        doSendInvite({
          uid: user.uid,
          avatarNumber,
          displayName,
          gameName,
          gameId: id,
          confirmed: true
        })
      })
  }
  const confirmedInvites = receivedInvites.filter(inv => inv.confirmed)
  const myGames = receivedInvites.filter(
    invite => invite.invitedBy === user.uid
  )

  function getContent() {
    switch (true) {
      case !!myGames.length: {
        return (
          <MyGames
            myGames={myGames}
            handleCancelGameName={handleCancelGameName}
          />
        )
      }
      case !!confirmedInvites.length: {
        return <ConfirmedInvite confirmedInvites={confirmedInvites} />
      }
      case !!receivedInvites.length: {
        return <ReceivedInvitesSection />
      }

      case !gameNameLocked:
        return (
          <NameGameSection
            gameName={gameName}
            handleLockGameName={handleLockGameName}
            setGameName={setGameName}
            gameNameLocked={gameNameLocked}
            handleCancelGameName={handleCancelGameName}
          />
        )
      default:
        return <SpinningPageLoader />
    }
  }
  return <FullHeightGrid container>{getContent()}</FullHeightGrid>
}

const StyledFlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 12rem;
  justify-content: space-around;
`
const NameGameSection = ({
  gameName,
  setGameName,
  handleLockGameName,
  handleCancelGameName,
  gameNameLocked
}) => {
  return (
    <StyledFlexColumn>
      <Typography gutterBottom variant="h4">
        1. Name a game
      </Typography>
      <TextField
        value={gameName}
        onChange={e => setGameName(e.target.value.toUpperCase())}
        label="Game Name"
      />
      <Button variant="contained" color="primary" onClick={handleLockGameName}>
        OK
      </Button>
    </StyledFlexColumn>
  )
}

export default GameStartWrapper
