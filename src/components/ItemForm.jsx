import React from "react"
import {
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from "@material-ui/core"

import { useAttrCtx } from "../contexts/AttrContext"
import shortid from "shortid"
import ShowMe from "../utils/ShowMe"
import { Form, Field } from "react-final-form"
import { useItemCtx } from "../contexts/ItemContext"
const ItemForm = () => {
  const { allAttrs } = useAttrCtx()
  const { allItems } = useItemCtx()
  const { saveItem, selectedItem } = useItemCtx()

  const newItem = {
    id: `item_${shortid.generate()}`
  }

  function handleSubmit(values) {
    values.firstLetter = values.name.trim()[0].toUpperCase()
    const newValues = Object.entries(values)
      .filter(([_attrId, value]) => {
        if (_attrId === "id") return true
        if (_attrId === "firstLetter") return true
        if (_attrId === "name") return true
        return !!allAttrs[_attrId]
      }, {})
      .reduce((_newValues, [_attrId, _optId]) => {
        _newValues[_attrId] = _optId
        // if (_attrId === "color__id") {
        //   const colorName = allAttrs.color__id.options[_optId].text
        //   let colorCode = colorName.slice(0, 2) // first 2 letter of color
        //   colorCode += colorName.split("")[colorName.length - 1] // last letter of color
        //   console.log("colorcode", colorCode)
        //   debugger
        //   _newValues.matchId[0] = colorCode.toUpperCase()
        // }
        // if (_attrId === "type__id") {
        //   const typeName = allAttrs.type__id.options[_optId].text
        //   console.log("typeName", typeName)
        //   const typeCode = typeName.slice(0, 3).toUpperCase()
        //   _newValues.matchId[1] = typeCode
        // }
        // if (_attrId === "firstLetter") {
        //   _newValues.matchId[2] = _optId
        // }
        return _newValues
      }, {})
    console.log("newValues", newValues)
    saveItem(newValues)
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Item Form</Typography>
      </Grid>
      <Form
        onSubmit={handleSubmit}
        initialValues={allItems[selectedItem] || newItem}
      >
        {({ handleSubmit, values, form }) => {
          return (
            <>
              <Grid item xs={12} sm={6}>
                <Field name="name">
                  {({ input }) => (
                    <TextField
                      fullWidth
                      label="Name"
                      value={input.value}
                      onChange={e => input.onChange(e.target.value)}
                    />
                  )}
                </Field>
              </Grid>
              {Object.values(allAttrs).map(attr => (
                <Grid key={attr.id} item xs={12} sm={6}>
                  <FormSelect attr={attr} />
                </Grid>
              ))}

              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                <ShowMe obj={values} name="values" noModal />
              </Grid>
            </>
          )
        }}
      </Form>
    </Grid>
  )
}

export default ItemForm

const FormSelect = ({ attr }) => {
  return (
    <Field name={attr.id}>
      {({ input }) => (
        <FormControl fullWidth>
          <InputLabel htmlFor="age-simple">{attr.name}</InputLabel>
          <Select
            value={input.value}
            onChange={e => input.onChange(e.target.value)}
            inputProps={{
              name: "age",
              id: "age-simple"
            }}
          >
            {Object.values(attr.options).map(opt => (
              <MenuItem key={opt.id} value={opt.id}>
                {opt.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Field>
  )
}
