import React, { useState } from "react"
import styled from "styled-components"
import { Button, Snackbar, SnackbarContent } from "@material-ui/core"
import {
  green,
  red,
  purple,
  blue,
  yellow,
  orange,
  brown
} from "@material-ui/core/colors"
//
import { removeUid } from "../../utils/imageUtils"
import ItemCard from "../ItemCard.jsx"
import { useItemCtx } from "../../contexts/ItemContext.js"
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"
import { useGameLogic } from "../../utils/gameLogic.js"
import { doItemsMatch } from "../../utils/gameLogic"
import ShowMe from "../../utils/ShowMe.jsx"
import { useGamePlayCtx } from "../../contexts/GamePlayCtx.js"
//
//
const TwoCardsDiv = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  .thumbs {
    font-size: 2rem;
    margin: 1rem;
  }
`

const fakeItem1 = "PUE_ANI_O_item_fGw2Q7nYc"
const fakeMatch1 = "PUE_TOY_D_item_7SHTf_0lL"
const fakeMatch2 = "BLE_ANI_D_item_eMN315QCgx"
const fakeMatch3 = "ORE_FRU_O_item_w1bGJEB9-"
const nonMatch = "RED_VEG_B_item_9ug9GMsaNR"

const PlayResponse = ({ _itemId1 = fakeItem1, _itemId2 = fakeMatch2 }) => {
  const { allItems } = useItemCtx()
  const [open, setOpen] = useState(true)
  const { state, dispatch } = useGamePlayCtx()
  const vertical = "top"
  const horizontal = "left"
  if (!state || !state.playResponse) return <div>missing state</div>
  const { itemId1, itemId2 } = state.playResponse
  const item1 = allItems[removeUid(itemId1)]
  const item2 = allItems[removeUid(itemId2)]
  if (!item1 || !item2) return <div>nope</div>
  const matches = doItemsMatch(itemId1, itemId2)
  const handleClose = () => {
    dispatch({ type: "CLOSE_SNACK" })
  }
  const handleOpen = () => {
    dispatch({ type: "OPEN_SNACK" })
  }
  return (
    <div>
      <Button onClick={handleOpen}>open playresponse</Button>
      <ShowMe obj={state} name="state" />
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={state && state.playResponse.open}
        onClose={handleClose}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        autoHideDuration={2500}
      >
        <SnackbarContent
          style={{ backgroundColor: matches ? green[200] : red[200] }}
          message={
            <TwoCardsDiv>
              <PlayResponseItemCard item={item1} matches={matches} />
              {matches ? (
                <FaThumbsUp className="thumbs" />
              ) : (
                <FaThumbsDown className="thumbs" />
              )}
              <PlayResponseItemCard item={item2} matches={matches} />
            </TwoCardsDiv>
          }
        />
      </Snackbar>
    </div>
  )
}

const PlayResItemBackground = styled.div`
  background-color: #ffffffbf;
  position: relative;
`
const PlayResponseItemCard = ({ item, matches }) => {
  const matchArray = matches
    ? Object.entries(matches).filter(([_, val]) => val)
    : []
  return (
    <>
      {" "}
      <PlayResItemBackground>
        {matchArray.map(([matchType, code]) => (
          <MatchDisplay
            key={(matchType, code)}
            matchType={matchType}
            code={code}
          />
        ))}
        <ItemCard item={item} />
      </PlayResItemBackground>
      {/* <ShowMe obj={matchArray} name="matchArray" /> */}
    </>
  )
}

const matchTypes = {
  color: {
    PUE: { text: "purple", bg: purple[100] },
    BRN: { text: "brown", bg: brown[100] },
    BLE: { text: "blue", bg: blue[100] },
    YEW: { text: "yellow", bg: yellow[100] },
    RED: { text: "red", bg: red[100] },
    ORE: { text: "orange", bg: orange[100] },
    GRN: { text: "green", bg: green[100] }
  },
  type: {
    ANI: { text: "ANIMAL" },
    TOY: { text: "TOY" },
    CLO: { text: "CLOTHES" },
    VEG: { text: "VEGETABLE" },
    FRU: { text: "FRUIT" }
  },
  firstLetter: {
    A: { text: "A" },
    B: { text: "B" },
    C: { text: "C" },
    D: { text: "D" },
    E: { text: "E" },
    G: { text: "G" },
    H: { text: "H" },
    L: { text: "L" },
    M: { text: "M" },
    O: { text: "O" },
    P: { text: "P" },
    R: { text: "R" },
    S: { text: "S" },
    T: { text: "T" }
  }
}
const offsets = {
  type: "top: -5px; left: -26px; transform: rotate(-22deg);",
  color: `top: -8px; right: -10px; transform: rotate(17deg);`,
  firstLetter: `font-size: 2.2rem; bottom: -4px; left: 3px; transform: rotate(-15deg);`
}
const FloatingMatchDisplay = styled.div`
  color: purple;
  position: absolute;
  background: white;
  border: 1px solid black;
  padding: 3px 5px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 1px 1px 3px 0px #00000099;
  ${p => offsets[p.matchType]}
`
const MatchDisplay = ({ matchType, code }) => {
  return (
    <FloatingMatchDisplay matchType={matchType}>
      {matchTypes[matchType][code].text}
    </FloatingMatchDisplay>
  )
}

export default PlayResponse
