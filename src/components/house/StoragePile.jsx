import React from "react"
import styled from "styled-components"
import { Grid } from "@material-ui/core"
//
import { QuantityCircle } from "../game/CenterPile/CenterPileDnD"
import DraggableCard, { WindowCard } from "./DraggableCard"
import woodtable from "../../images/woodtable.jpg"
import { useWiderThan } from "../../hooks/useWidth.js"
import { useGameCtx, useStoragePileCtx } from "../../contexts/GameCtx.js"
import { useAuthCtx } from "../../contexts/AuthCtx.js"
import { useAllItemsCtx } from "../../contexts/AllItemsCtx.js"
import MyTurnDisplay from "./MyTurnDisplay.jsx"
//
//
const StyledGrid = styled(Grid)`
  border: 1px solid green;
  margin-top: 4rem !important;
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .yourturn {
    color: ${p => (p.myturn ? "green" : "grey")};
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
  const { allItems } = useAllItemsCtx()
  const { gamePlay } = useGameCtx()
  const { storagePile = [] } = useStoragePileCtx()
  const { user } = useAuthCtx()
  const mdUp = useWiderThan("md")
  if (!gamePlay) return <div>waiting for game</div>
  const myturn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.uid === user.uid
      ? true
      : undefined

  if (!allItems) return null
  // const storagePile = houseState && houseState.storagePile

  return (
    <StyledGrid myturn={myturn} container spacing={2}>
      <Grid item xs={12} md={6} className="center">
        <StorageTable width={mdUp ? 11 : 9}>
          {!!storagePile && (
            <>
              {/* only the top card is draggable */}
              <DraggableCard scale={1.5} itemId={storagePile[0]} index={1} />
              {/* the remaining cards are images */}
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
          <QuantityCircle
            background="#2f3235"
            quantity={storagePile && storagePile.length}
          />
        </StorageTable>
      </Grid>
      <Grid item xs={12} md={6} className="quantity-display">
        {myturn && <MyTurnDisplay />}
      </Grid>
    </StyledGrid>
  )
}

export default StoragePile
