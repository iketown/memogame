import React from "react"
import { Avatar } from "@material-ui/core"
import { FaUser } from "react-icons/fa"

const AvatarMonster = ({ num, ...passThruProps }) => {
  if (!num)
    return (
      <Avatar>
        <FaUser />
      </Avatar>
    )
  return (
    <Avatar
      src={`https://api.adorable.io/avatars/95/${num}.png`}
      {...passThruProps}
    />
  )
}

export default AvatarMonster
