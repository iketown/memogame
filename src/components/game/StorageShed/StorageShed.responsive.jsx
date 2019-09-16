import React, { memo } from "react"
import styled from "styled-components"
import { Roof } from "../../house/House.responsive.jsx"
import { Room } from "../../house/RoomDnD/RoomDnD"
import { useStoragePileCtx } from "../../../contexts/GameCtx"
import DraggableCard, { WindowCard } from "../../house/DraggableCard.jsx"
import { useWindowSize } from "../../../hooks/useScreenSize"
import isEqual from "lodash/isEqual"

export const HalfRoof = styled(Roof)`
  height: 13px;
`

const StorageShedContainer = () => {
  const { storagePile = [] } = useStoragePileCtx()
  const { heightText } = useWindowSize()
  return <StorageShed storagePile={storagePile} heightText={heightText} />
}

const StorageShed = memo(({ storagePile, heightText }) => {
  console.log("StorageShed renders")
  return (
    <div>
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
    </div>
  )
}, propsEqual)

export default StorageShedContainer

function propsEqual(prev, next) {
  const prevSP = prev.storagePile
  const nextSP = next.storagePile
  const pilesEqual = isEqual(prevSP, nextSP)
  return pilesEqual
}
