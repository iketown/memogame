import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@material-ui/core"

//
//
const ButtonLink = ({ to, children, color, variant }) => {
  return (
    <Link to={to}>
      <Button variant={variant} color={color}>
        {children}
      </Button>
    </Link>
  )
}

export default ButtonLink
