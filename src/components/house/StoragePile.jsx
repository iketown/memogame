import React from "react"
//
import DraggableCard from "./DraggableCard.jsx"
import { useItemCtx } from "../../contexts/ItemContext.js"
import { useHouseGridCtx } from "../../contexts/HouseGridCtx"
import ShowMe from "../../utils/ShowMe.jsx"
import { Button } from "@material-ui/core"

//
//
const StoragePile = () => {
  const { allItems } = useItemCtx()
  const { houseDispatch, houseState, fillHouse } = useHouseGridCtx()
  if (!allItems) return null
  return (
    <div>
      storage Pile
      <Button onClick={fillHouse}>fill house</Button>
      <ShowMe obj={houseState} name="houseState" />
      <ShowMe obj={allItems} name="allItems" />
    </div>
  )
}

export default StoragePile
