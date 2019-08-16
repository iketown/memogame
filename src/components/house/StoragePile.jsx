import React from "react"
import styled from "styled-components"
import { Grid, Typography } from "@material-ui/core"
//
import { useItemCtx } from "../../contexts/ItemContext.js"
import { useHouseGridCtx } from "../../contexts/HouseGridCtx"
import ShowMe from "../../utils/ShowMe.jsx"
import { Button, Card, useMediaQuery } from "@material-ui/core"
import NewDraggableCard, { WindowCard } from "./NewDraggableCard.jsx"
import woodtable from "../../images/woodtable.jpg"
import { useWidth, useWiderThan } from "../../hooks/useWidth.js"
import { useGameCtx, useStoragePileCtx } from "../../contexts/GameCtx.js"
import { useAuthCtx } from "../../contexts/AuthCtx.js"
//
//
const StyledGrid = styled(Grid)`
  border: 1px solid green;
  margin-top: 4rem !important;
  .center {
    text-align: center;
  }
  .yourturn {
    color: ${p => (p.myTurn ? "green" : "grey")};
  }
  .quantity-display {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
  }
`
const StorageTable = styled.div`
  position: relative;
  width: ${p => p.width}rem;
  height: ${p => p.width}rem;
`
const TableImage = styled.div`
  position: absolute;
  width: ${p => p.width}rem;
  height: ${p => p.width}rem;
  border-bottom: 7px solid #440b0b;
  border-radius: 50%;
  background-image: url(${woodtable});
  background-size: cover;
  background-color: #795548;
  box-shadow: 7px 8px 8px 0px #8c8c8c;
  top: 0;
  left: -1.5rem;
  transform: scaleY(0.95);
`

const StoragePile = () => {
  const { allItems } = useItemCtx()
  const { gamePlay } = useGameCtx()
  const { storagePile = [] } = useStoragePileCtx()
  const { user } = useAuthCtx()
  const mdUp = useWiderThan("md")
  const myTurn = gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid
  const othersTurnText =
    gamePlay.whosTurnItIs && `${gamePlay.whosTurnItIs.displayName}'s`
  if (!allItems) return null
  // const storagePile = houseState && houseState.storagePile

  return (
    <StyledGrid myTurn={myTurn} container spacing={2} justify="center">
      <Grid item xs={12} md={6}>
        <StorageTable width={mdUp ? 11 : 9}>
          {!!storagePile && (
            <>
              <NewDraggableCard scale={1.5} itemId={storagePile[0]} index={1} />
              {storagePile.slice(1).map((itemId, index) => (
                <WindowCard
                  scale={1.5}
                  index={index + 2}
                  key={itemId}
                  itemId={itemId}
                />
              ))}
            </>
          )}
          <TableImage width={mdUp ? 11 : 9} />
        </StorageTable>
      </Grid>
      <Grid item xs={12} md={6} className="quantity-display">
        <Typography variant="h4" className="yourturn">
          {myTurn ? "YOUR" : othersTurnText} turn
        </Typography>
        <div className="center">
          <Typography variant="h4">
            {storagePile && storagePile.length}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            cards in STORAGE
          </Typography>
        </div>
      </Grid>
    </StyledGrid>
  )
}

export default StoragePile
