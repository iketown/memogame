import React from "react"
import { Card, Typography } from "@material-ui/core"
import styled from "styled-components"
import { useAttrCtx } from "../contexts/AttrContext"
import { Draggable } from "react-beautiful-dnd"
//
//
const SCard = styled(Card)`
  width: 10rem;
  /* height: 5rem; */
  background: #fbfbfb !important;
`
const StyledMain = styled.div`
  text-align: center;
  .colorText,
  .nameText {
    line-height: 18px;
  }
`
const StyledDetails = styled.div`
  display: flex;
  justify-content: space-between;
`
const SContainer = styled.div`
  padding: 5px 8px;
`
const ItemCard = ({ item, index = 0, faceDown, noDrag }) => {
  const { allAttrs } = useAttrCtx()
  if (!item) return <div>no item</div>
  if (!allAttrs) return <div>no attrs</div>
  const { name, color__id, firstLetter, id, type__id } = item
  const colorText = allAttrs.color__id.options[color__id].text
  const typeText = allAttrs.type__id.options[type__id].text
  const cardContent = faceDown ? (
    <SCard className="expanding-card">
      <div>back side yo</div>
    </SCard>
  ) : (
    <SCard className="expanding-card">
      <SContainer>
        <StyledMain>
          <Typography
            className="colorText"
            variant="subtitle1"
            color="textSecondary"
          >
            {colorText}
          </Typography>
          <Typography
            component="span"
            color="textPrimary"
            className="nameText"
            variant="subtitle1"
            style={{ textDecoration: "underline" }}
          >
            {name.slice(0, 1)}
          </Typography>
          <Typography
            color="textSecondary"
            component="span"
            className="nameText"
            variant="subtitle2"
          >
            {name.slice(1)}
          </Typography>
        </StyledMain>
        <StyledDetails>
          <Typography
            className="firstLetter"
            color="textSecondary"
            variant="caption"
          >
            {firstLetter}
          </Typography>
          <Typography
            className="typeText"
            color="textSecondary"
            variant="caption"
          >
            {typeText}
          </Typography>
        </StyledDetails>
      </SContainer>
    </SCard>
  )
  if (noDrag) return cardContent
  return (
    <Draggable draggableId={item.id} index={index}>
      {({ dragHandleProps, draggableProps, innerRef }) => (
        <div ref={innerRef} {...dragHandleProps} {...draggableProps}>
          {cardContent}
        </div>
      )}
    </Draggable>
  )
}

export default ItemCard

export const CardBack = () => {
  return <SCard>card back</SCard>
}
