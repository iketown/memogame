import React, { useState, useEffect } from "react"
import styled from "styled-components"
import moment from "moment"
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core"
import { FaTrashAlt } from "react-icons/fa"
import { useFirebase } from "../contexts/FirebaseCtx"
import { useGameCtx } from "../contexts/GameCtx"
import { useAllItemsCtx } from "../contexts/AllItemsCtx"
import { usePlayersCtx } from "../contexts/PlayersCtx"
import AvatarMonster from "./AvatarMonster"

const StyledBox = styled.div`
  max-height: 10rem;
  overflow-y: scroll;
`

const LogBox = () => {
  const { doRemoveLog, fdb } = useFirebase()
  const {
    gameState: { gameId }
  } = useGameCtx()
  const [log, setLog] = useState()

  useEffect(() => {
    const gameLogRef = fdb.ref(`/currentGames/${gameId}/gameLog`)
    gameLogRef.on("value", snapshot => {
      setLog(snapshot.val())
    })
  }, [fdb, gameId])

  const handleTrash = logId => {
    doRemoveLog({ gameId, logId })
  }

  const logList = (log && Object.entries(log).reverse()) || []
  return (
    <StyledBox>
      <List dense>
        {log &&
          logList.map(([id, msg], index) => {
            const nextEntry = logList[index + 1] && logList[index + 1][1]
            const prevEntry = logList[index - 1] && logList[index - 1][1]
            return (
              <LogListItem
                nextEntry={nextEntry}
                prevEntry={prevEntry}
                key={id}
                msg={msg}
                handleTrash={() => handleTrash(id)}
              />
            )
          })}
      </List>
    </StyledBox>
  )
}

const StyledListItem = styled(ListItem)`
  padding: 0;
  .list-text {
    margin: 0;
  }
  .avatar {
    width: 30px;
    height: 30px;
  }
`

const LogListItem = ({ msg, handleTrash, nextEntry }) => {
  const { itemFromItemId } = useAllItemsCtx()
  const { players } = usePlayersCtx()
  const {
    gameState: { members }
  } = useGameCtx()
  const personX = members.find(mem => mem.uid === msg.uid)
  const person = players && players[msg.uid]
  const samePersonAsNext = nextEntry && nextEntry.uid === msg.uid
  const [timeText, setTimeText] = useState(moment(msg.timeStamp).fromNow())
  useEffect(() => {
    const everyThirtySec = setInterval(() => {
      const newTimeText = moment(msg.timeStamp).fromNow()
      setTimeText(newTimeText)
    }, 30000)
    return () => clearInterval(everyThirtySec)
  }, [msg.timeStamp])
  const item = itemFromItemId(msg.itemId)
  function formatText(txt, bolded) {
    return bolded ? (
      <b style={{ textDecoration: "underline" }}>{txt}</b>
    ) : (
      <span>{txt}</span>
    )
  }
  const { valid } = msg
  const personText = person && person.displayName
  const toCenter = msg.destination === "center"
  const verb = toCenter ? "plays" : "puts"
  let textString = "card in house"
  if (toCenter) {
    const colorText = formatText(item.color__id, valid && valid.color)
    const typeText = formatText(item.type__id, valid && valid.type)

    const firstLetterText = formatText(
      item.firstLetter,
      valid && valid.firstLetter
    )
    const itemText = (
      <span>
        {firstLetterText}
        {item.name.slice(1)}
      </span>
    )
    const emoji = !!valid ? (
      <span role="img" aria-label="smiley face">
        👍🏽
      </span>
    ) : (
      <span role="img" aria-label="sad face">
        😖
      </span>
    )
    textString = (
      <span>
        {colorText} {itemText} ({typeText}) {emoji}
      </span>
    )
  }
  const displayTextString = (
    <span>
      {personText} {verb} {textString}
    </span>
  )
  return (
    <StyledListItem dense>
      {!samePersonAsNext && (
        <ListItemAvatar>
          <AvatarMonster num={person && person.avatarNumber} />
        </ListItemAvatar>
      )}
      <ListItemText
        inset={samePersonAsNext}
        className="list-text"
        primary={displayTextString}
        secondary={!samePersonAsNext && timeText}
      />
      <ListItemSecondaryAction onClick={handleTrash}>
        <IconButton size="small" style={{ fontSize: "13px" }}>
          <FaTrashAlt />
        </IconButton>
      </ListItemSecondaryAction>
    </StyledListItem>
  )
}

export default LogBox
