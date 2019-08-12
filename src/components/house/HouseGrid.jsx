import React, { useState } from "react"
import styled from "styled-components"
import {
  Grid,
  Typography,
  CardContent,
  Card,
  CardHeader,
  CardActions,
  Button
} from "@material-ui/core"
//
import ShowMe from "../../utils/ShowMe.jsx"
import { useHouseGridCtx } from "../../contexts/HouseGridCtx"
import houseImage from "../../images/handDrawnHouse.svg"
import HouseWindow from "./HouseWindow"
import { useWidth } from "../../hooks/useWidth"
import { HouseGridCtxProvider } from "../../contexts/HouseGridCtx"
import StoragePile from "./StoragePile"
//

export const houseDimensions = {
  xs: { houseWidth: "15rem", windowHeight: "65px", rowHeight: "103px" },
  sm: { houseWidth: "15rem", windowHeight: "65px", rowHeight: "103px" },
  md: { houseWidth: "20rem", windowHeight: "90px", rowHeight: "138px" },
  lg: { houseWidth: "20rem", windowHeight: "90px", rowHeight: "138px" },
  xl: { houseWidth: "20rem", windowHeight: "90px", rowHeight: "138px" }
}
const StyleHouseGrid = styled.div`
  position: relative;
  /* background-image: url(${houseImage}); */
  width: ${p => houseDimensions[p.width].houseWidth};
  display: grid;
  grid-template-areas:  "attic attic" "bedroom bathroom" "family kitchen" "cellar cellar";
  grid-template-rows:  repeat(4, ${p => houseDimensions[p.width].rowHeight});
  justify-content: space-around;
  align-items: end;
  justify-items: center;
  &:after {
    content: "";
    background: url(${houseImage});
    background-size: cover;
    filter: saturate(.6);
    opacity: 0.7;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: -1;   
  }
  &:before {
    transition: all .5s;
    top: -15px;
    left: -15px;
    bottom: -15px;
    right: -15px;
    position: absolute;
    background-color: black;
    opacity: 0;
    content: '';
    ${p =>
      p.expanded
        ? `
    /* darken the background when a room is selected */
    opacity: 0.5;
    z-index: 6;   
    `
        : ``}
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
    width: ${p => houseDimensions[p.width].windowHeight};
    height: ${p => houseDimensions[p.width].windowHeight};
    background: #0000007a;
    border-radius: 10px;
    transition: 0.3s all;
    position: relative;
  }
`

const windowArr = [
  { className: "attic", roomId: "attic", display: "attic" },
  { className: "bedroom", roomId: "bedroom", display: "bedroom" },
  { className: "bathroom", roomId: "bathroom", display: "bathroom" },
  { className: "family", roomId: "family", display: "family" },
  { className: "kitchen", roomId: "kitchen", display: "kitchen" },
  { className: "cellar", roomId: "cellar", display: "cellar" }
]
const HouseGrid = () => {
  const width = useWidth()
  const [expanded, setExpanded] = useState(false)
  return (
    <HouseGridCtxProvider>
      <Grid container>
        <Grid item xs={6}>
          <StyleHouseGrid
            width={width}
            expanded={expanded}
            onClick={() => setExpanded(false)}
          >
            <SelectedRoomView expanded={expanded} setExpanded={setExpanded} />
            {windowArr.map(({ className, roomId, display }) => (
              <div key={roomId} className={className}>
                <HouseWindow
                  expanded={expanded === roomId}
                  setExpanded={setExpanded}
                  roomId={roomId}
                  display={display}
                />
              </div>
            ))}
          </StyleHouseGrid>
        </Grid>
        <Grid item xs={6}>
          <StoragePile />
        </Grid>
      </Grid>
    </HouseGridCtxProvider>
  )
}

export default HouseGrid

const StyledSelectedRoom = styled.div`
  grid-area: 1 /1 / -1 / -1;
  z-index: 20;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .card {
    height: 90%;
    width: 90%;
    display: flex;
    flex-direction: column;
    .content {
      flex-grow: 1;
    }
  }
`
const SelectedRoomView = ({ expanded, setExpanded }) => {
  const { houseState } = useHouseGridCtx()
  if (!expanded) return null
  const thisRoom = houseState.house[expanded]
  console.log("thisRoom", thisRoom)
  console.log("house", houseState)
  return (
    <StyledSelectedRoom onClick={e => e.stopPropagation()}>
      <Card className="card">
        <CardHeader title={expanded.toUpperCase()} />
        <CardContent className="content">
          <ShowMe obj={thisRoom} name="thisRoom" />
          {thisRoom.map(itemId => (
            <p key={itemId}>{itemId}</p>
          ))}
        </CardContent>
        <CardActions>
          <Button onClick={() => setExpanded(false)}>ok</Button>
        </CardActions>
      </Card>
    </StyledSelectedRoom>
  )
}
