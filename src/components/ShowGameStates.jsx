import React, { useState } from "react"
import { Grid, Collapse, Card, CardHeader, IconButton } from "@material-ui/core"
import { FaCaretUp, FaCaretDown } from "react-icons/fa"

import {
  useCenterPileCtx,
  useHouseCtx,
  useStoragePileCtx
} from "../contexts/GameCtx"
import ShowMe from "../utils/ShowMe"

const ShowGameStates = () => {
  const { centerPile } = useCenterPileCtx()
  const { myHouse } = useHouseCtx()
  const { storagePile } = useStoragePileCtx()
  return (
    <Grid container spacing={2}>
      <StateDisplay obj={centerPile} name="centerPile" />
      <StateDisplay obj={myHouse} name="myHouse" />
      <StateDisplay obj={storagePile} name="storagePile" />
    </Grid>
  )
}

export default ShowGameStates

const StateDisplay = ({ obj, name }) => {
  const [open, setOpen] = useState(false)
  return (
    <Grid item xs={12} md={4}>
      <Card>
        <CardHeader
          subheader={name}
          action={
            <IconButton size="small" onClick={() => setOpen(old => !old)}>
              {open ? <FaCaretDown /> : <FaCaretUp />}
            </IconButton>
          }
        />
        <Collapse in={open}>
          <ShowMe obj={obj} name={name} noModal />
        </Collapse>
      </Card>
    </Grid>
  )
}
