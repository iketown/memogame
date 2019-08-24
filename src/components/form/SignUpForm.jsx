import React from "react"
import styled from "styled-components"
import { Form, Field } from "react-final-form"
import { Grid, Typography, Button, TextField } from "@material-ui/core"
import { FaUser } from "react-icons/fa"
//
import { useFirebase } from "../../contexts/FirebaseCtx"
import ShowMe from "../../utils/ShowMe.jsx"
import FormTextInput from "./FormTextInput.jsx"
import { useDialogCtx } from "../../contexts/DialogCtx.js"
import { useAuthCtx } from "../../contexts/AuthCtx"
//
//
const StyledForm = styled.form`
  .center {
    text-align: center;
  }
`
const SignUpForm = () => {
  const { doCreateUserWithEmailAndPassword, firestore } = useFirebase()
  const { handleCloseForm } = useDialogCtx()
  const { user } = useAuthCtx()
  firestore
    .collection("publicProfiles")
    .doc(user.uid)
    .set({})
  function formSubmit(values) {
    console.log("values", values)
    const { email, password } = values
    return doCreateUserWithEmailAndPassword(email.trim(), password.trim())
      .then(authUser => {
        handleCloseForm()
        console.log("authUser", authUser)
      })
      .catch(err => {
        console.log("signup error", err)
        return err
      })
  }
  function validate(values) {
    const { password, passwordConf, email } = values
    const errors = {}
    if (!email) errors.email = "Email Required"
    if (!password) errors.password = "Password Required"
    if (!passwordConf) errors.passwordConf = "Password Confirmation Required"
    if (password && passwordConf && password !== passwordConf)
      errors.passwordConf = "Passwords must match!"
    return errors
  }
  return (
    <Form validate={validate} onSubmit={formSubmit}>
      {({ handleSubmit, values, hasValidationErrors, submitErrors }) => {
        console.log("form errors", submitErrors)
        return (
          <StyledForm onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} className="center">
                <FaUser />
                <Typography variant="subtitle1">SIGN UP</Typography>
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
              <Grid item xs={12}>
                <FormTextInput
                  name="passwordConf"
                  label="Password Confirmation"
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
                  Sign Up!
                </Button>
              </Grid>
            </Grid>
          </StyledForm>
        )
      }}
    </Form>
  )
}

export default SignUpForm
