import React from "react"
import styled from "styled-components"
import { Grid, Avatar, Typography } from "@material-ui/core"
import { FaWarehouse, FaHome } from "react-icons/fa"
//
import MiniPlayerDisplay from "./MiniPlayerDisplay"
import { useGameCtx } from "../../../contexts/GameCtx"
import { useAuthCtx } from "../../../contexts/AuthCtx"
import { usePlayersCtx } from "../../../contexts/PlayersCtx.js"
import { useTurnTimer, useOthersTurnTimer } from "../../../hooks/useTurnTimer"
import ScrollingPointsDisplay from "../ScrollingPointsDisplay.jsx"
import { useOtherPlayerInfo } from "../../../hooks/usePlayerInfo.js"
import AvatarMonster from "../../AvatarMonster.jsx"
import TurnTimer from "../Timers/TurnTimer.jsx"
//
//

const StyledDisplay = styled.div`
  flex-grow: ${p => (p.myTurn ? 1 : 0)};
  transition: 0.4s flex-grow;
  position: relative;
  max-width: 10rem;
  display: grid;
  grid-template-areas: "username username username" "avatar storage total" "avatar house total" "timer timer timer";
  grid-template-columns: 46px 1fr 3rem;
  align-items: center;
  /* grid-template-rows: repeat(2, 19px); */
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
  .icon {
    color: #9e9e9e;
    margin-right: 4px;
  }
`
export const PlayerDisplay = ({ playerId }) => {
  const {
    points,
    storageCount,
    houseCount,
    secondsLeft,
    publicProfile
  } = useOtherPlayerInfo(playerId)
  const { gamePlay } = useGameCtx()
  const { lastCheckIn } = gamePlay.whosTurnItIs
  const myTurn = gamePlay && gamePlay.whosTurnItIs.uid === playerId
  return myTurn ? (
    <StyledDisplay myTurn={myTurn}>
      {publicProfile && (
        <Typography variant="caption" className="name-display">
          {publicProfile.displayName}
        </Typography>
      )}
      <AvatarMonster className="avatar" num={publicProfile.avatarNumber} />

      <div className="storage">
        <FaWarehouse className="icon" />
        <Typography component="b" variant="subtitle1">
          {storageCount}
        </Typography>{" "}
      </div>
      <div className="house">
        <FaHome className="icon" />
        <Typography component="b" variant="subtitle1">
          {houseCount}
        </Typography>{" "}
      </div>
      <ScrollingPointsDisplay points={points} className="total" />
      <div className="timer">
        <TurnTimer key={lastCheckIn} playerId={playerId} />
      </div>
      {/* {!!secondsLeft && <TimerBoxes secondsLeft={secondsLeft} />} */}
    </StyledDisplay>
  ) : (
    <MiniPlayerDisplay playerId={playerId} myTurn={myTurn} />
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

export default PlayerDisplay
