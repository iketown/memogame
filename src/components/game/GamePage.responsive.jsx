import React, { useState } from "react"
import { useWidth, useWindowSize } from "../../hooks/useScreenSize"
import styled from "styled-components"
import House from "../house/House.responsive"
import CenterSquare from "./CenterPile/CenterSquare.responsive.jsx"
import StorageShed from "./StorageShed/StorageShed.responsive.jsx"
import ScoreSection from "./Scores/ScoreSection.responsive"
import { Fab, IconButton, SwipeableDrawer, Button } from "@material-ui/core"
import { FaHome, FaArrowRight } from "react-icons/fa"
import { DndProvider } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
//
//

function getTemplateAreas(width) {
  switch (width) {
    case "xs":
      return ` "score score" "storage center" "house house" `
    case "sm":
      return ` "house score" "house center" "house storage" `
    case "md":
    case "lg":
    case "xl":
      return ` "house center score" "house storage score" `
    default:
      return ""
  }
}

const ResponsiveGamePageGrid = styled.div`
  width: 100%;
  height: calc(100vh - 75px);
  /* margin-top: 5px; */
  border: 1px solid orange;
  display: grid;
  position: relative;
  grid-template-columns: max-content, max-content;
  grid-gap: 5px;
  grid-template-rows: ${p =>
    p.mobileSize ? "max-content, max-content, 1fr" : "repeat(3, max-content)"};
  grid-template-areas: ${p => getTemplateAreas(p.width)};
`
const HouseSection = styled.div`
  grid-area: house;
  text-align: center;
  position: relative;
`
const CenterSection = styled.div`
  grid-area: center;
  text-align: center;
`
const StorageSection = styled.div`
  grid-area: storage;
  text-align: center;
`
const ScoreSectionContainer = styled.div`
  grid-area: score;
`
const GamePage = () => {
  const widthText = useWidth()
  const { heightText } = useWindowSize()
  return (
    <DndProvider backend={HTML5Backend}>
      <ResponsiveGamePageGrid mobileSize={widthText === "xs"} width={widthText}>
        <ScoreSectionContainer>
          <ScoreSection />
        </ScoreSectionContainer>
        <HouseSection className="text-center">
          <House />
        </HouseSection>
        <CenterSection className="text-center">
          <CenterSquare />
        </CenterSection>
        <StorageSection className="text-center">
          <StorageShed />
        </StorageSection>
      </ResponsiveGamePageGrid>
    </DndProvider>
  )
}

export default GamePage
