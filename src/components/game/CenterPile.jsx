import React, { useEffect } from "react"
import styled from "styled-components"
import { Droppable } from "react-beautiful-dnd"
//
import { useGameCtx } from "../../contexts/GameCtx"
import ShowMe from "../../utils/ShowMe"
import { Typography } from "@material-ui/core"
import { useItemCtx } from "../../contexts/ItemContext"
import ItemCard from "../ItemCard"
import UnderCard from "./UnderCard"
import { removeUid } from "../../utils/imageUtils"
//
//
const PileDiv = styled.div`
  margin: 3rem;
  position: relative;
`
const CenterPile = () => {
  const { gamePlay } = useGameCtx()
  const { allItems } = useItemCtx()
  const centerPile = (gamePlay && gamePlay.centerCardPile) || []
  const [topItem, ...otherItems] = centerPile

  const whoseTurn =
    gamePlay && gamePlay.whosTurnItIs && gamePlay.whosTurnItIs.displayName
  return (
    <>
      <Typography variant="subtitle2">Center Pile</Typography>
      <Typography color="textSecondary" variant="caption">
        current turn:
      </Typography>
      <Typography variant="h6">{whoseTurn}</Typography>
      <Droppable droppableId={"centerPile"}>
        {({ droppableProps, innerRef, placeholder }) => {
          return (
            <PileDiv {...droppableProps} ref={innerRef}>
              {topItem && <ItemCard item={allItems[removeUid(topItem)]} />}
              {/* {placeholder} */}
              {otherItems.map((itemId, index) => (
                <UnderCard itemId={itemId} key={itemId} index={index + 1}>
                  {itemId}
                </UnderCard>
              ))}
            </PileDiv>
          )
        }}
      </Droppable>
      <ShowMe obj={gamePlay} name="gamePlay" />
    </>
  )
}

export default CenterPile
