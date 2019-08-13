import React from "react"
import styled from "styled-components"
import { Droppable } from "react-beautiful-dnd"
//
import { useItemCtx } from "../../contexts/ItemContext.js"
import { useHouseGridCtx } from "../../contexts/HouseGridCtx"
import ShowMe from "../../utils/ShowMe.jsx"
import { Button, Card } from "@material-ui/core"
import NewDraggableCard, { WindowCard } from "./NewDraggableCard.jsx"

//
//
const StorageTable = styled.div`
  position: relative;
  width: 15rem;
  height: 15rem;
`

const StoragePile = () => {
  const { allItems } = useItemCtx()
  const { houseDispatch, houseState, fillHouse } = useHouseGridCtx()
  if (!allItems) return null
  const storagePile = houseState && houseState.storagePile
  const cardsExist = storagePile && storagePile.length
  return (
    <div>
      storage Pile
      <Button onClick={fillHouse}>fill house</Button>
      <Droppable droppableId="storagePile">
        {({ droppableProps, innerRef }) => (
          <StorageTable ref={innerRef} {...droppableProps}>
            {cardsExist && (
              <>
                <NewDraggableCard
                  scale={1.5}
                  itemId={storagePile[0]}
                  index={1}
                />
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
          </StorageTable>
        )}
      </Droppable>
      <br />
      <br />
      <br />
      <Droppable droppableId="practice">
        {({ droppableProps, innerRef }, { isDraggingOver }) => (
          <div
            style={{
              width: "10rem",
              height: "10rem",
              border: "1px solid green",
              background: isDraggingOver ? "orange" : "white"
            }}
            {...droppableProps}
            ref={innerRef}
          />
        )}
      </Droppable>
    </div>
  )
}

export default StoragePile
