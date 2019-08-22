import React, { useState, useEffect, useRef } from "react"
import Attribute from "../resources/Attribute"
import {
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardContent,
  CardActions,
  CardHeader
} from "@material-ui/core"
import { FaTimesCircle, FaEdit } from "react-icons/fa"
import ShowMe from "../utils/ShowMe"
import shortid from "shortid"
//
import { useAttrCtx } from "../contexts/AttrContext"

//
//
const AttributeForm = () => {
  const [name, setName] = useState("")
  const [optionText, setOptionText] = useState([])
  const [attr, setAttr] = useState(createNewAttr())
  const { allAttrs, saveAttr, deleteAttr } = useAttrCtx()
  const [editingName, setEditingName] = useState(true)
  function createNewAttr() {
    return {
      id: `attr_${shortid.generate()}`,
      options: []
    }
  }
  function resetForm() {
    setAttr(createNewAttr())
  }
  const saveName = () => {
    setAttr(attr => ({ ...attr, id: `${name.toLowerCase()}__id`, name }))
    setName("")
    setEditingName(false)
  }
  const addOption = () => {
    const newOptions = attr.options ? { ...attr.options } : {}
    const newOpt = {
      id: `opt_${optionText}`,
      text: optionText
    }
    newOptions[newOpt.id] = newOpt
    setAttr(attr => ({ ...attr, options: newOptions }))
    setOptionText("")
    nameField.current.focus()
  }
  const removeOption = optId => {
    const newOptions = { ...attr.options }

    delete newOptions[optId]
    setAttr(attr => ({ ...attr, options: newOptions }))
  }

  const notEditingNameContent = (
    <>
      <h4>{attr.name}</h4>
      <Button onClick={() => setEditingName(true)}>edit</Button>
    </>
  )
  const editingNameContent = (
    <>
      <TextField
        label="name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Button onClick={saveName}>save name</Button>
      <IconButton onClick={() => setEditingName(false)}>
        <FaTimesCircle />
      </IconButton>
    </>
  )
  const nameField = useRef()
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        left side
        {Object.entries(allAttrs).map(([id, attr]) => (
          <Card key={id}>
            <CardHeader
              title={attr.name}
              action={
                <>
                  <IconButton onClick={() => deleteAttr(id)}>
                    <FaTimesCircle />
                  </IconButton>
                  <IconButton onClick={() => setAttr(attr)}>
                    <FaEdit />
                  </IconButton>
                </>
              }
            />
            <CardContent>
              <List dense>
                {Object.values(attr.options).map(opt => (
                  <ListItem key={opt.id} dense>
                    <ListItemText primary={opt.text} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
        <ShowMe obj={allAttrs} name="allAttrs" noModal />
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardActions>
            {editingName ? editingNameContent : notEditingNameContent}
          </CardActions>
          <CardContent>
            <List>
              {attr.options &&
                Object.values(attr.options).map((opt, i) => (
                  <ListItem key={opt.id}>
                    <ListItemText primary={opt.text} key={opt.id} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => removeOption(opt.id)}>
                        <FaTimesCircle />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </CardContent>
          <CardActions>
            <TextField
              innerRef={nameField}
              label="name"
              value={optionText}
              onChange={e => setOptionText(e.target.value)}
            />
            <Button onClick={addOption}>add option</Button>
          </CardActions>
        </Card>
        <h3>options</h3>

        <Button
          onClick={() => {
            saveAttr(attr)
            createNewAttr()
          }}
          color="primary"
          variant="contained"
        >
          SAVE THIS ATTR
        </Button>
        <Button onClick={resetForm}>NEW</Button>
        <ShowMe obj={attr} name="attr" noModal />
      </Grid>
    </Grid>
  )
}

export default AttributeForm
