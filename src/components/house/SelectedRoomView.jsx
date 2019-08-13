import React from "react"
import styled from "styled-components"
import {
  CardContent,
  Card,
  CardHeader,
  CardActions,
  Button
} from "@material-ui/core"
//
import ShowMe from "../../utils/ShowMe.jsx"
import { useHouseGridCtx } from "../../contexts/HouseGridCtx"
//

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

export default SelectedRoomView
