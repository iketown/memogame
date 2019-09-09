import React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import { useOtherPlayerInfo } from "../../../hooks/usePlayerInfo"
import AvatarMonster from "../../AvatarMonster.jsx"
//
//
const StyledMiniDiv = styled.div`
  flex-grow: 0.2;
  transition: 0.4s flex-grow;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const MiniPlayerDisplay = ({ playerId }) => {
  const { points, publicProfile } = useOtherPlayerInfo(playerId)
  return (
    <StyledMiniDiv>
      <AvatarMonster num={publicProfile.avatarNumber} />
      <Typography variant="caption" color="textSecondary">
        {publicProfile.displayName}
      </Typography>
      <Typography variant="subtitle1">{points}</Typography>
    </StyledMiniDiv>
  )
}

export default MiniPlayerDisplay
