import React from "react"
import styled from "styled-components"
import { Grid, Avatar, Typography } from "@material-ui/core"
//
import CenterPileDnD from "./CenterPileDnD.jsx"
import { useGameCtx } from "../../contexts/GameCtx.js"
import ShowMe from "../../utils/ShowMe.jsx"
import { useAuthCtx } from "../../contexts/AuthCtx.js"
//
//
const StyledBox = styled(Grid)`
  border: 1px solid navy;
`
const OtherPlayersView = () => {
  const { gamePlay } = useGameCtx()
  const { user } = useAuthCtx()
  const gameStates = gamePlay && gamePlay.gameStates

  return (
    <StyledBox container spacing={2}>
      <Grid item xs={12} md={6}>
        <CenterPileDnD />
      </Grid>
      <Grid item xs={12} md={6}>
        {gameStates &&
          Object.entries(gameStates)
            // .filter(([playerId]) => playerId !== user.uid)
            .map(([playerId, playerState]) => (
              <PlayerDisplay
                key={playerId}
                playerId={playerId}
                playerState={playerState}
              />
            ))}
      </Grid>
    </StyledBox>
  )
}

export default OtherPlayersView

const StyledDisplay = styled.div`
  display: grid;
  grid-template-areas: "avatar storage total" "avatar house total";
  grid-template-columns: 46px 1fr 3rem;
  align-items: center;
  grid-template-rows: repeat(2, 19px);
  margin-bottom: 5px;
  opacity: ${p => (p.myTurn ? 1 : 0.4)};
  padding: 10px;
  box-shadow: 1px 1px 2px #7d7d7d;
  border-radius: 8px;
  .avatar {
    grid-area: avatar;
  }
  .storage {
    grid-area: storage;
  }
  .house {
    grid-area: house;
  }
  .total {
    grid-area: total;
    text-align: center;
  }
`
const PlayerDisplay = ({ playerId, playerState }) => {
  const houseCount =
    (playerState &&
      playerState.house &&
      Object.values(playerState.house).reduce((sum, room) => {
        if (room.length) sum += room.length
        return sum
      }, 0)) ||
    0
  const storageCount =
    (playerState.storagePile && playerState.storagePile.length) || 0
  const { gamePlay } = useGameCtx()
  const myTurn = gamePlay && gamePlay.whosTurnItIs.uid === playerId
  return (
    <>
      <StyledDisplay myTurn={myTurn}>
        <Avatar
          className="avatar"
          src={`https://api.adorable.io/avatars/95/${playerId}.png`}
        />
        <div className="storage">
          <Typography component="b" variant="subtitle1">
            {storageCount}
          </Typography>{" "}
          <Typography component="span" variant="caption" color="textSecondary">
            in storage
          </Typography>
        </div>
        <div className="house">
          <Typography component="b" variant="subtitle1">
            {houseCount}
          </Typography>{" "}
          <Typography component="span" variant="caption" color="textSecondary">
            in house
          </Typography>
        </div>
        <div className="total">
          <Typography variant="h5" style={{ marginBottom: "-10px" }}>
            {houseCount + storageCount}
          </Typography>
          <Typography variant="overline" color="textSecondary">
            TOTAL
          </Typography>
        </div>
      </StyledDisplay>
      {/* <ShowMe obj={playerState} name="playerState" /> */}
    </>
  )
}
