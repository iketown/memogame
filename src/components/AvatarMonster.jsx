import React from "react"
import { Avatar } from "@material-ui/core"
import { FaUser } from "react-icons/fa"

const AvatarMonster = ({ num }) => {
  if (!num)
    return (
      <Avatar>
        <FaUser />
      </Avatar>
    )
  return (
    <Avatar
      className="avatar"
      src={`https://api.adorable.io/avatars/95/${num}.png`}
    />
  )
}

export default AvatarMonster
