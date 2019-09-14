import React from "react"
import styled from "styled-components"
import { HouseContainer, Roof } from "../../house/House.responsive.jsx"
import { Room } from "../../house/RoomDnD/RoomDnD"
import { useStoragePileCtx } from "../../../contexts/GameCtx"
import DraggableCard, { WindowCard } from "../../house/DraggableCard.jsx"
import { useWindowSize } from "../../../hooks/useScreenSize"
export const HalfRoof = styled(Roof)`
  height: 13px;
`

const StorageShed = () => {
  console.log("StorageShed renders")
  const { storagePile = [] } = useStoragePileCtx()
  const { heightText } = useWindowSize()
  return (
    <HouseContainer>
      <Room height={heightText}>
        <>
          {/* only the top card is draggable */}
          <DraggableCard
            scale={1.5}
            itemId={storagePile[0]}
            source="storage"
            index={1}
          />
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
      </Room>
    </HouseContainer>
  )
}

export default StorageShed
