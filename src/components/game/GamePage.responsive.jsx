import React from "react"
import { useWidth } from "../../hooks/useScreenSize"
import styled from "styled-components"
import House from "../house/House.responsive"
import CenterSquare from "./CenterPile/CenterSquare.responsive.jsx"
import StorageShed from "./StorageShed/StorageShed.responsive.jsx"
import ScoreSection from "./Scores/ScoreSection.responsive"
import { DndProvider } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import { Admin } from "../../hooks/Admin"
import YourTurnDisplay from "./Timers/YourTurnDisplay"
import { useHouseCtx, HouseCtxProvider } from "../../contexts/HouseContext"

//
//

function getTemplateAreas(width) {
  switch (width) {
    case "xs":
      return ` "score score" "storage center" "house house" "yourturn yourturn" `
    case "sm":
      return ` "score yourturn" "house center" "house storage" `
    case "md":
    case "lg":
    case "xl":
      return ` "house center score" "house storage yourturn" `
    default:
      return ""
  }
}

export const ResponsiveGamePageGrid = styled.div`
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
  justify-items: center;
  align-items: center;
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
const YourTurnSectionContainer = styled.div`
  grid-area: yourturn;
  display: flex;
  justify-content: center;
  align-items: center;
`
const GamePage = () => {
  const widthText = useWidth()
  const { setSelectedRoom } = useHouseCtx()
  return (
    <DndProvider backend={HTML5Backend}>
      <ResponsiveGamePageGrid
        onClick={() => setSelectedRoom({ roomId: "", faceUp: false })}
        mobileSize={widthText === "xs"}
        width={widthText}
      >
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
        <YourTurnSectionContainer>
          <YourTurnDisplay />
        </YourTurnSectionContainer>
      </ResponsiveGamePageGrid>
    </DndProvider>
  )
}

const GamePageWithHouse = () => {
  return (
    <HouseCtxProvider>
      <GamePage />
    </HouseCtxProvider>
  )
}

export default GamePageWithHouse
