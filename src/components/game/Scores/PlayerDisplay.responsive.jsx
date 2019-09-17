import React from "react"
import styled from "styled-components"
import { Typography } from "@material-ui/core"
import { FaWarehouse, FaHome } from "react-icons/fa"
//
import MiniPlayerDisplay from "./MiniPlayerDisplay"
import ScrollingPointsDisplay from "../ScrollingPointsDisplay.jsx"
import { useOtherPlayerInfo } from "../../../hooks/usePlayerInfo.js"
import AvatarMonster from "../../AvatarMonster.jsx"
import TurnTimer from "../Timers/TurnTimer.jsx"
import { useGamePlayCtx } from "../../../contexts/GamePlayCtx"
//
//

const GreenBox = styled.div`
  height: 4px;
  width: 4px;
  margin-right: 2.5px;
  background: green;
`
const BoxContainer = styled.div`
  display: flex;
  justify-content: left;
  width: 100%;
`

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
  margin: 10px;
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
    publicProfile
  } = useOtherPlayerInfo(playerId)
  const { gamePlay } = useGamePlayCtx("PlayerDisplay")
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
        <TurnTimer
          key={lastCheckIn}
          playerId={playerId}
          render={({ getTime }) =>
            getTime() > 0 ? (
              <BoxContainer>
                {Array.from({ length: Math.min(getTime() / 1000, 20) }).map(
                  (sec, i) => (
                    <GreenBox key={i} />
                  )
                )}
              </BoxContainer>
            ) : (
              <span style={{ fontSize: "9px", color: "grey" }}>
                waiting for admin response
              </span>
            )
          }
        />
      </div>
    </StyledDisplay>
  ) : (
    <MiniPlayerDisplay playerId={playerId} myTurn={myTurn} />
  )
}

export default PlayerDisplay
