import React, { useMemo } from "react"
import { Draggable } from "react-beautiful-dnd"
import styled from "styled-components"
import { useWidth } from "../../hooks/useWidth"
import { Card, Avatar } from "@material-ui/core"
//
import { imageFromItemId } from "../../images/cards/index"
import { houseDimensions } from "./HouseGrid.jsx"
import { FaTimesCircle } from "react-icons/fa"
//
//
const NewDraggableCard = ({ itemId, scale, index }) => {
  return (
    <Draggable index={index} draggableId={itemId}>
      {({ dragHandleProps, draggableProps, innerRef }) => (
        <div ref={innerRef} {...draggableProps} {...dragHandleProps}>
          <WindowCard index={index} itemId={itemId} scale={scale} dragMe />
        </div>
      )}
    </Draggable>
  )
}

export default NewDraggableCard

const offsetMultiplier = 3
const StyledCard = styled(Card)`
  height: ${p => p.heightwidth};
  width: ${p => p.heightwidth};
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${p => p.imageSvg});
  background-size: cover;
  z-index: ${p => 200 - p.index};
  position: absolute;
`
const BackgroundCard = styled(StyledCard)`
  top: ${p => p.index * offsetMultiplier}px;
  left: ${p => p.index * offsetMultiplier - 8}px;
  transform: scale(${p => 1 - p.index * 0.03}) rotate(${p => p.rotation}deg);
`

export const WindowCard = ({ index, itemId, scale = 1, dragMe }) => {
  const widthText = useWidth()
  const { windowHeight } = houseDimensions[widthText]
  const { imageSvg, rotation } = useMemo(() => {
    const imageSvg = index < 5 ? imageFromItemId(itemId) : ""
    const rotation = (Math.random() - 0.5) * 14
    return { imageSvg, rotation }
  }, [index, itemId])
  const cardProps = {
    heightwidth: `calc(${windowHeight} * ${scale})`,
    index,
    imageSvg,
    rotation,
    className: `cards card${index}`
  }
  return dragMe ? (
    <StyledCard {...cardProps} />
  ) : (
    <BackgroundCard {...cardProps}>{index}</BackgroundCard>
  )
}

export const BackgroundPile = () => {}
