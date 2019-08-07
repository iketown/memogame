import React from "react"
import {
  Grid,
  DialogContent,
  DialogTitle,
  Avatar,
  DialogActions,
  Button
} from "@material-ui/core"
import styled from "styled-components"
import { FaUser } from "react-icons/fa"
import { Form, Field } from "react-final-form"
//
import { useAuthCtx } from "../../contexts/AuthCtx"
import ShowMe from "../../utils/ShowMe"
import FormTextInput from "./FormTextInput"

//
//

const StyledHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
`
const EditProfile = () => {
  const { user } = useAuthCtx()
  console.log("user", user)
  if (!user) return null
  const { email, displayName } = user
  const handleSubmit = values => {
    console.log("values", values)
    const { displayName, email, favColor } = values
    user.updateProfile({
      displayName,
      email,
      favColor
    })
  }
  return (
    <>
      <StyledHeader>
        <Avatar>
          <FaUser />
        </Avatar>
        <DialogTitle>Edit Profile</DialogTitle>
      </StyledHeader>
      <Form onSubmit={handleSubmit} initialValues={{ email, displayName }}>
        {({
          handleSubmit,
          values,
          hasValidationErrors,
          hasSubmitErrors,
          pristine,
          errors
        }) => (
          <>
            {" "}
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormTextInput name="displayName" label="Display Name" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextInput name="email" label="Email" />
                </Grid>

                {/* <Grid container item xs={12}>
                  <ShowMe obj={values} name="values" />
                  <ShowMe obj={errors} name="errors" />
                </Grid> */}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={pristine || hasValidationErrors || hasSubmitErrors}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Save
              </Button>
            </DialogActions>
          </>
        )}
      </Form>
    </>
  )
}

export default EditProfile
