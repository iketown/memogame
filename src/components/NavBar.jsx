import React from "react"
import { Button } from "@material-ui/core"
import { Link } from "react-router-dom"
import styled from "styled-components"

const ButtonLink = ({ to, children }) => {
  return (
    <Link to={to}>
      <Button>{children}</Button>
    </Link>
  )
}

const StyledDiv = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`
const NavBar = () => {
  return (
    <StyledDiv>
      <ButtonLink to="/attributes">Attributes</ButtonLink>
      <ButtonLink to="/items">Items</ButtonLink>
      <ButtonLink to="/allcards">Cards</ButtonLink>
      <ButtonLink to="/dragtest">Drag Test</ButtonLink>
      <ButtonLink to="/house">House</ButtonLink>
    </StyledDiv>
  )
}

export default NavBar
