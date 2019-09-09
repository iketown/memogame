import React, { useState } from "react"
import styled from "styled-components"
import { Grid, Typography } from "@material-ui/core"
import { DndProvider } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
//
import NewSelectedRoomView from "./SelectedRoomView/NewSelectedRoomView.jsx"
import OtherPlayersView from "../game/OtherPlayersView.jsx"
import houseImage from "../../images/handDrawnHouse.svg"
import { useWiderThan } from "../../hooks/useScreenSize"
import {
  HouseGridCtxProvider,
  useHouseGridCtx
} from "../../contexts/HouseGridCtx"
import StoragePile from "./StoragePile"
import HouseDropSection from "./HouseDropSection"
import { useGameCtx, useHouseCtx } from "../../contexts/GameCtx"
import { usePlayersCtx } from "../../contexts/PlayersCtx"
import GameOver from "./GameOver.jsx"
import ShowMe from "../../utils/ShowMe.jsx"
//

export const houseDimensions = {
  xs: { houseWidth: "15rem", rowHeight: "103px" },
  sm: { houseWidth: "15rem", rowHeight: "103px" },
  md: { houseWidth: "20rem", rowHeight: "138px" },
  lg: { houseWidth: "20rem", rowHeight: "138px" },
  xl: { houseWidth: "20rem", rowHeight: "138px" }
}
const StyleHouseGrid = styled.div`
  position: relative;
  width: ${p => p.width}rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "attic attic" "bedroom bathroom" "family kitchen" "cellar cellar";
  grid-template-rows: repeat(4, ${p => p.rowHeight}px);
  justify-content: space-around;
  align-items: end;
  justify-items: center;
  &:after {
    content: "";
    background: url(${houseImage});
    background-size: cover;
    opacity: 0.7;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: -1;
  }
  &:before {
    transition: all 0.5s;
    top: -15px;
    left: -15px;
    bottom: -15px;
    right: -15px;
    position: absolute;
    background-color: black;
    opacity: 0;
    content: "";
    ${p =>
      p.expanded
        ? `
    /* darken the background when a room is selected */
    opacity: 0.5;
    z-index: 6;   
    `
        : ``}
  }
  .window {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .dragging {
    background-color: orange;
  }
  .attic {
    grid-area: attic;
  }
  .bedroom {
    grid-area: bedroom;
  }
  .bathroom {
    grid-area: bathroom;
  }
  .family {
    grid-area: family;
  }
  .kitchen {
    grid-area: kitchen;
  }
  .cellar {
    grid-area: cellar;
  }

  .houseWindow {
    width: ${p => p.windowHeight}px;
    height: ${p => p.windowHeight}px;
    background: #0000007a;
    border-radius: 10px;
    transition: 0.3s all;
    position: relative;
  }
`

const windowArr = [
  { roomId: "attic", display: "attic" },
  { roomId: "bedroom", display: "bedroom" },
  { roomId: "bathroom", display: "bathroom" },
  { roomId: "family", display: "family" },
  { roomId: "kitchen", display: "kitchen" },
  { roomId: "cellar", display: "cellar" }
]
const HouseGrid = () => {
  const mdUp = useWiderThan("md")
  const [expanded, setExpanded] = useState(false)
  const { myHouseTimer } = useHouseCtx()
  const { gameState } = useGameCtx()
  const { players } = usePlayersCtx()
  const { cardsInMyHouse } = useHouseCtx()
  const gameOver = gameState.completed
  if (gameOver) return <GameOver />
  return (
    <DndProvider backend={HTML5Backend}>
      <HouseGridCtxProvider>
        <Grid container>
          <Grid item xs={6}>
            <StyleHouseGrid
              width={mdUp ? 20 : 15}
              windowHeight={mdUp ? 90 : 65}
              rowHeight={mdUp ? 138 : 103}
              expanded={expanded}
              onClick={() => setExpanded(false)}
            >
              <NewSelectedRoomView />
              {windowArr.map(({ roomId, display }) => (
                <HouseDropSection
                  setExpanded={setExpanded}
                  key={roomId}
                  roomId={roomId}
                  display={display}
                />
              ))}
            </StyleHouseGrid>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Typography variant="subtitle1">
                House Cards: {cardsInMyHouse}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <>
              <OtherPlayersView />
              <StoragePile />
              {/* <ShowMe obj={players} name="players" noModal />
              <ExpandedRoomView /> */}
            </>
          </Grid>
        </Grid>
      </HouseGridCtxProvider>
    </DndProvider>
  )
}

export default HouseGrid
