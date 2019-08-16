import React, { useState } from "react"
import {
  Button,
  Toolbar,
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  ListItemText
} from "@material-ui/core"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { useFirebase } from "../contexts/FirebaseCtx"
import { auth } from "firebase"
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
const NavBar = () => {
  // const { user } = useFirebase()
  const { user, displayName } = useAuthCtx()
  const { state, dispatch: dialogDispatch } = useDialogCtx()
  const { fsdb } = useFirebase()
  const handleAuth = formType => () => {
    dialogDispatch({ type: "OPEN_FORM", formType })
  }
  const signedInMenuItems = (
    <>
      <UserMenuButton /> <span>{displayName}</span>
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
        {/* <ButtonLink to="/attributes">Attributes</ButtonLink>
        <ButtonLink to="/items">Items</ButtonLink>
        <ButtonLink to="/allcards">Cards</ButtonLink>
        <ButtonLink to="/playresponse">PlayResponse</ButtonLink>
        <ButtonLink to="/housegrid">House Grid</ButtonLink> */}

        <ButtonLink to="/gamestart">Start a Game</ButtonLink>
        {user && signedInMenuItems}
        {!user && signedOutMenuItems}
      </Toolbar>
    </AppBar>
  )
}

export default NavBar

const UserMenuButton = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { dispatch } = useDialogCtx()
  const { doSignOut } = useFirebase()
  const { user } = useAuthCtx()
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
  if (!user) return null

  return (
    <>
      <IconButton onClick={handleClick} size="small" color="inherit">
        <FaUser />
      </IconButton>
      <Menu onClose={handleClose} anchorEl={anchorEl} open={!!anchorEl}>
        <MenuList>
          <MenuItem>
            <ListItemText />
            {user.email}
          </MenuItem>
          <MenuItem>hey</MenuItem>
          <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
          <MenuItem onClick={doSignOut}>Sign Out</MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}
