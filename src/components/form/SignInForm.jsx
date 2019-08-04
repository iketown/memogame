import React from "react"
import styled from "styled-components"
import { Form, Field } from "react-final-form"
import { Grid, Typography, Button, TextField } from "@material-ui/core"
//
import FormTextInput from "./FormTextInput.jsx"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { FaUser } from "react-icons/fa"
import { useDialogCtx } from "../../contexts/DialogCtx"
//
//
const StyledForm = styled.form`
  .center {
    text-align: center;
  }
`
const SignInForm = () => {
  const { doSignInWithUserAndPassword } = useFirebase()
  const { handleCloseForm } = useDialogCtx()
  function formSubmit(values) {
    const { email, password } = values
    return doSignInWithUserAndPassword(email.trim(), password.trim())
      .then(authUser => {
        console.log("authUser", authUser)
        handleCloseForm()
      })
      .catch(err => {
        console.log("signIn error", err)
        return err
      })
  }
  function validate(values) {
    const { password, passwordConf, email } = values
    const errors = {}
    if (!email) errors.email = "Email Required"
    if (!password) errors.password = "Password Required"
    return errors
  }
  return (
    <Form validate={validate} onSubmit={formSubmit}>
      {({ handleSubmit, values, hasValidationErrors, submitErrors }) => {
        return (
          <StyledForm onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} className="center">
                <FaUser />
                <Typography variant="subtitle1">SIGN IN</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormTextInput name="email" label="Email" type="email" />
              </Grid>
              <Grid item xs={12}>
                <FormTextInput
                  name="password"
                  label="Password"
                  type="password"
                />
              </Grid>

              {submitErrors && (
                <Grid item xs={12}>
                  {submitErrors.message}
                </Grid>
              )}
              <Grid item xs={12} className="center">
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={hasValidationErrors}
                >
                  Sign In!
                </Button>
              </Grid>
            </Grid>
          </StyledForm>
        )
      }}
    </Form>
  )
}

export default SignInForm
