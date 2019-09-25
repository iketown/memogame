import React from "react"
import { Field } from "react-final-form"
import { TextField } from "@material-ui/core"

//
//
const FormTextInput = ({
  name,
  type = "text",
  label,
  required,
  placeholder,
  maxLength,
  endAdornment,
  startAdornment,
  formatInput = val => val,
  onBlur
}) => {
  return (
    <Field
      name={name}
      type={type}
      render={({ input, meta }) => (
        <TextField
          {...input}
          onChange={e => input.onChange(formatInput(e.target.value))}
          label={label}
          fullWidth
          placeholder={placeholder}
          helperText={meta.touched && meta.error}
          error={meta.touched && !!meta.error}
          FormHelperTextProps={{ style: { color: "red" } }}
          variant="outlined"
          required={required}
          inputProps={{ maxLength, onBlur }}
          // InputProps={{ endAdornment, startAdornment }}
        />
      )}
    />
  )
}

export default FormTextInput
