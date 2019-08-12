import React, { useState } from "react"
import {
  Grid,
  ListItem,
  ListItemText,
  ListItemAvatar,
  List,
  Collapse,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Typography,
  Button,
  ListSubheader
} from "@material-ui/core"
import styled from "styled-components"
import ItemForm from "../components/ItemForm.jsx"
import ShowMe from "../utils/ShowMe.jsx"
import { FaCaretDown, FaCaretUp, FaEdit, FaTrashAlt } from "react-icons/fa"
//
import { useAttrCtx } from "../contexts/AttrContext.js"
import { useItemCtx } from "../contexts/ItemContext"
import {
  ItemFilterCtxProvider,
  useItemFilterCtx
} from "../contexts/ItemFilterCtx"
import ItemChart from "../components/ItemChart.jsx"
import { useItemMatches } from "../hooks/useItemMatches.js"
//
//
const Items = () => {
  const { allAttrs } = useAttrCtx()
  const { allItems, handleSelectItem, itemsAttrsObj } = useItemCtx()

  return (
    <ItemFilterCtxProvider>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ItemChart />
        </Grid>
        <Grid item xs={6}>
          <List dense>
            <ListSubheader>
              {`${Object.keys(allItems).length} items`}
            </ListSubheader>
            {Object.values(allItems)
              .sort((a, b) => {
                // sort by name
                return a.name < b.name ? -1 : 1
              })
              .map(item => (
                <ItemListItem item={item} key={item.id} />
              ))}
          </List>
          <Button onClick={() => handleSelectItem()}>create new</Button>
          <ShowMe obj={allItems} name="allItems" noModal />
          <ShowMe obj={allAttrs} name="allAttrs" noModal />
        </Grid>
        <Grid item xs={6}>
          <ItemForm />
          <ShowMe obj={itemsAttrsObj} name="itemsAttrsObj" noModal />
        </Grid>
      </Grid>
    </ItemFilterCtxProvider>
  )
}

export default Items

const ItemTextArea = styled.div`
  display: flex;
  align-items: center;
  .matches {
    margin-left: 10px;
  }
`

const ItemListItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false)
  const { state } = useItemFilterCtx()
  const { allAttrs } = useAttrCtx()
  const { allItems, handleSelectItem, deleteItem } = useItemCtx()
  const { matchesObj, matchesQuantity } = useItemMatches(item)
  // console.log("matchesObj", item.name, matchesObj)
  function toggleExpanded() {
    setExpanded(old => !old)
  }
  if (state.soloAttr) {
    const { attrId, optId } = state.soloAttr
    if (item[attrId] !== optId) return null
  }
  return (
    <>
      <ListItem dense>
        <ListItemAvatar>
          <Avatar>{item.firstLetter}</Avatar>
        </ListItemAvatar>
        <ItemTextArea>
          <Typography
            component="span"
            variant="body2"
            color="textSecondary"
            style={{ marginRight: "5px" }}
          >
            {allAttrs.color__id.options[item.color__id].text}
          </Typography>
          <ListItemText primary={item.name} />
          <Typography
            onClick={() => console.log(matchesObj)}
            variant="caption"
            className="matches"
          >{`${matchesQuantity} matches`}</Typography>
        </ItemTextArea>
        <ListItemSecondaryAction>
          <IconButton size="small" onClick={() => deleteItem(item.id)}>
            <FaTrashAlt />
          </IconButton>

          <IconButton size="small" onClick={() => handleSelectItem(item.id)}>
            <FaEdit />
          </IconButton>
          <IconButton size="small" onClick={toggleExpanded}>
            {expanded ? <FaCaretDown /> : <FaCaretUp />}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={expanded}>
        {/* {Object.entries(item)
          .filter(([attrId]) => attrId.slice(0, 4) === "attr")
          .map(([attrId, optId]) => (
            <AttrView key={attrId} attrId={attrId} optId={optId} item={item} />
          ))} */}
        <AttributesCollapsedView item={item} />
      </Collapse>
    </>
  )
}

const AttrCollDiv = styled.div`
  font-size: 9px;
  text-align: center;
`

const AttributesCollapsedView = ({ item }) => {
  const { itemsAttrsObj } = useItemCtx()
  const { allAttrs } = useAttrCtx()

  const { id, name, firstLetter, ...itemAttrs } = item
  if (!itemsAttrsObj) return <p>loading...</p>
  const firstLetterItems = itemsAttrsObj.firstLetter[firstLetter].items.filter(
    _item => _item.id !== item.id
  )
  return (
    <AttrCollDiv>
      <AttrLineItem
        name="First Letter"
        value={item.firstLetter}
        sharedItems={firstLetterItems}
      />
      {Object.entries(itemAttrs).map(([attrId, optId]) => {
        if (!allAttrs[attrId]) return <div>{attrId} no bueno</div>
        if (!itemsAttrsObj[attrId][optId]) return <div>{optId} no bueno</div>
        const attrName = allAttrs[attrId].name
        // debugger
        const sharedItems = itemsAttrsObj[attrId][optId].items.filter(
          _item => _item.id !== item.id
        )
        const attrValue = itemsAttrsObj[attrId][optId].text
        return (
          <AttrLineItem
            key={attrId}
            sharedItems={sharedItems || "error"}
            name={attrName}
            value={attrValue}
          />
        )
      })}
    </AttrCollDiv>
  )
}
const StyledLi = styled.li`
  font-size: 11px;
`
const AttrLineItem = ({ name, sharedItems, value }) => {
  return (
    <StyledLi>
      {name}: {value} | total: {sharedItems.length} | shared with:{" "}
      {sharedItems.map((item, i) => `${!!i ? ", " : ""}${item.name}`)}
    </StyledLi>
  )
}
