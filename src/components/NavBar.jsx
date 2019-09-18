import React, { useState, useEffect } from "react"
import {
  Button,
  Toolbar,
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  ListItem,
  ListItemText,
  Typography,
  Collapse,
  List,
  ListItemAvatar
} from "@material-ui/core"
import AvatarMonster from "./AvatarMonster.jsx"
import BrainGears from "../images/BrainGears.jsx"
import { withRouter, Link } from "react-router-dom"
import { useFirebase } from "../contexts/FirebaseCtx"
import { useAuthCtx } from "../contexts/AuthCtx"
import { useDialogCtx } from "../contexts/DialogCtx"
import ButtonLink from "./navigation/ButtonLink.jsx"
import { useWidth, useWindowSize } from "../hooks/useScreenSize"
import { FaBars } from "react-icons/fa"

const NavBar = props => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const menus = {
    sm: [
      <IconButton
        key={123}
        onClick={() => setMobileOpen(old => !old)}
        children={<FaBars color="white" />}
      />
    ]
  }
  const { user, publicProfile } = useAuthCtx()
  const widthText = useWidth()
  const { heightText } = useWindowSize()

  const { dispatch: dialogDispatch } = useDialogCtx()
  const handleAuth = formType => () => {
    dialogDispatch({ type: "OPEN_FORM", formType })
  }
  const signedInMenuItems = (
    <>
      <ButtonLink to="/gamestart">Start a Game</ButtonLink>
      <UserMenuButton history={props.history} />
      <span style={{ marginLeft: "8px" }}>
        {publicProfile && publicProfile.displayName}
      </span>
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

  function getContent() {
    switch (widthText) {
      case "xs":
      case "sm":
        return menus.sm
      case "md":
      case "lg":
        return <div>menu</div>
      default:
        return <div>no width</div>
    }
  }
  return (
    <>
      <AppBar position="static" key={user}>
        <Toolbar style={{ minHeight: "fit-content" }}>
          <BrainGears height="30px" style={{ flexGrow: 1 }} />
          <Typography variant="h6" style={{ flexGrow: 1, marginLeft: "5px" }}>
            <Link style={{ color: "inherit", textDecoration: "none" }} to="/">
              MEMOGA.ME {widthText}
            </Link>
          </Typography>

          {!!user && signedInMenuItems}
          {!user && signedOutMenuItems}
          {getContent()}
        </Toolbar>
      </AppBar>
      <ExpandingMenu open={mobileOpen} />
    </>
  )
}

export default withRouter(NavBar)

const ExpandingMenu = withRouter(({ open, history }) => {
  return (
    <Collapse in={open}>
      <List>
        <ListItem>
          <ListItemAvatar>
            <UserMenuButton history={history} />
          </ListItemAvatar>
          My User Name
        </ListItem>
        <ListItem>hey</ListItem>
        <ListItem>hey</ListItem>
      </List>
    </Collapse>
  )
})

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
