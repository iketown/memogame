import React, { useState } from "react"
import {
  Button,
  Toolbar,
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  ListItemText,
  Typography,
  Avatar
} from "@material-ui/core"
import AvatarMonster from "./AvatarMonster.jsx"
import BrainGears from "../images/BrainGears.jsx"
import styled from "styled-components"
import { withRouter } from "react-router-dom"
import { useFirebase } from "../contexts/FirebaseCtx"
import { useAuthCtx } from "../contexts/AuthCtx"
import { useDialogCtx } from "../contexts/DialogCtx"
import { FaUser } from "react-icons/fa"
import ButtonLink from "./navigation/ButtonLink.jsx"

const StyledDiv = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`
const NavBar = props => {
  // const { user } = useFirebase()
  const { user, publicProfile } = useAuthCtx()

  const { state, dispatch: dialogDispatch } = useDialogCtx()
  const handleAuth = formType => () => {
    dialogDispatch({ type: "OPEN_FORM", formType })
  }
  const signedInMenuItems = (
    <>
      <ButtonLink to="/gamestart">Start a Game</ButtonLink>
      <UserMenuButton history={props.history} />
      <span>{publicProfile && publicProfile.displayName}</span>
    </>
  )
  const signedOutMenuItems = (
    <>
      <Button onClick={handleAuth("signIn")} color="inherit">
        Sign In
      </Button>
      <Button onClick={handleAuth("signUp")} color="inherit">
        Sign Up
      </Button>
    </>
  )
  return (
    <AppBar position="static" key={user}>
      <Toolbar>
        <BrainGears height="40px" />
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          MEMOGA.ME
        </Typography>

        {!!user && signedInMenuItems}
        {!user && signedOutMenuItems}
      </Toolbar>
    </AppBar>
  )
}

export default withRouter(NavBar)

const UserMenuButton = ({ history }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { dispatch } = useDialogCtx()
  const { doSignOut } = useFirebase()
  const { user, publicProfile } = useAuthCtx()
  const handleClick = e => {
    setAnchorEl(e.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleEditProfile = () => {
    dispatch({ type: "OPEN_FORM", formType: "editProfile" })
    handleClose()
  }
  const handleSignOut = async () => {
    await doSignOut()
    history.push("/")
  }
  const handleMyGames = () => {
    history.push("/mygames")
  }
  if (!user) return <div />

  return (
    <>
      <IconButton onClick={handleClick} size="small" color="inherit">
        <AvatarMonster num={publicProfile && publicProfile.avatarNumber} />
      </IconButton>
      <Menu onClose={handleClose} anchorEl={anchorEl} open={!!anchorEl}>
        <MenuList>
          <MenuItem>
            <ListItemText />
            {user.email}
          </MenuItem>
          <MenuItem onClick={handleMyGames}>My Games</MenuItem>
          <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}
