import React, { useState } from "react"
import styled from "styled-components"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Avatar
} from "@material-ui/core"
import { MdInfo } from "react-icons/md"

const MiniText = styled.pre`
  font-size: ${p => p.zoom * 10}px;
  color: green;
`
const YellowBox = styled.div`
  background: #fdfde2;
  border-radius: 5px;
  border: 1px solid #dada00;
`
const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`
function ShowMe({ obj, name, noModal }) {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  if (noModal)
    return (
      <YellowBox>
        <TopRow>
          <p>{name}</p>
          <div>
            <Button onClick={() => setZoom(old => old - 0.5)}>-</Button>
            <Button onClick={() => setZoom(old => old + 0.5)}>+</Button>
          </div>
        </TopRow>
        <MiniText zoom={zoom}>{JSON.stringify(obj, 0, 2)}</MiniText>
      </YellowBox>
    )
  return (
    <>
      <Chip
        avatar={
          <Avatar>
            <MdInfo />
          </Avatar>
        }
        onClick={e => {
          e.stopPropagation()
          setOpen(true)
        }}
        label={name}
      />
      <Dialog
        maxWidth="md"
        fullWidth
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>{name}</DialogTitle>
        <DialogContent>
          <div>
            <MiniText>{JSON.stringify(obj, 0, 2)}</MiniText>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ShowMe
