import React from "react"
import styled from "styled-components"
import { Grid, Avatar, Typography } from "@material-ui/core"
//
import CenterPileDnD from "./CenterPile/CenterPileDnD.jsx"
import { useGameCtx } from "../../contexts/GameCtx.js"
import { useAuthCtx } from "../../contexts/AuthCtx.js"
import { usePlayersCtx } from "../../contexts/PlayersCtx.js"
import { useTurnTimer, useOthersTurnTimer } from "../../hooks/useTurnTimer"
import ScrollingPointsDisplay from "./ScrollingPointsDisplay.jsx"
//
//
const StyledBox = styled(Grid)`
  border: 1px solid navy;
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
const OtherPlayersView = () => {
  const { gamePlay } = useGameCtx()
  const gameStates = gamePlay && gamePlay.gameStates
  const { players } = usePlayersCtx()
  return (
    <StyledBox container spacing={2}>
      <Grid item xs={12} md={6} className="center">
        <CenterPileDnD />
      </Grid>
      <Grid item xs={12} md={6}>
        {gameStates &&
          gamePlay.memberUIDs &&
          Object.entries(gameStates)
            .sort((a, b) => {
              return gamePlay.memberUIDs.indexOf(a[0]) <
                gamePlay.memberUIDs.indexOf(b[0])
                ? -1
                : 1
            })
            .map(([playerId, playerState]) => (
              <PlayerDisplay
                key={playerId}
                publicProfile={players[playerId]}
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
  position: relative;
  display: grid;
  grid-template-areas: "username username username" "avatar storage total" "avatar house total" "timer timer timer";
  grid-template-columns: 46px 1fr 3rem;
  align-items: center;
  grid-template-rows: repeat(2, 19px);
  margin-bottom: 5px;
  opacity: ${p => (p.myTurn ? 1 : 0.4)};
  padding: 10px;
  box-shadow: 1px 1px 2px #7d7d7d;
  border-radius: 8px;
  .name-display {
    grid-area: username;
    color: ${p => (p.myTurn ? "blue" : "gainsboro")};
  }
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
  .timer {
    grid-area: timer;
  }
`
const PlayerDisplay = ({ playerId, playerState, publicProfile }) => {
  const points = (playerState && playerState.points) || 0
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
  const secondsLeft = useOthersTurnTimer({ playerId })
  return (
    <StyledDisplay myTurn={myTurn}>
      {publicProfile && (
        <Typography variant="caption" className="name-display">
          {publicProfile.displayName}
        </Typography>
      )}
      <Avatar
        className="avatar"
        src={`https://api.adorable.io/avatars/95/${
          publicProfile ? publicProfile.avatarNumber : playerId
        }.png`}
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
      <ScrollingPointsDisplay points={points} className="total" />

      {!!secondsLeft && <TimerBoxes secondsLeft={secondsLeft} />}
    </StyledDisplay>
  )
}

const StyledTimerDiv = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  grid-gap: 1px;
`
const StyledTimerBox = styled.div`
  /* border: 1px solid gainsboro; */
  transition: 1s opacity;
  opacity: ${p => (p.visible ? 1 : 0)};
  background: green;
  height: 4px;
  width: 4px;
`
const TimerBoxes = ({ secondsLeft }) => {
  return (
    <StyledTimerDiv className="timer">
      {Array.from({ length: 24 }, x => x).map((x, index) => (
        <StyledTimerBox visible={index < secondsLeft} key={index} />
      ))}
    </StyledTimerDiv>
  )
}
