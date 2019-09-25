import React from "react"
import styled from "styled-components"
import { Form } from "react-final-form"
import { Grid, Typography, Button } from "@material-ui/core"
//
import ChooseAvatar from "./ChooseAvatar.jsx"
import AvatarMonster from "../AvatarMonster.jsx"
import { useFirebase } from "../../contexts/FirebaseCtx"
import FormTextInput from "./FormTextInput.jsx"
import { useDialogCtx } from "../../contexts/DialogCtx.js"
//
//
const StyledForm = styled.form`
  .center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`
const SignUpForm = () => {
  const { doCreateUserWithEmailAndPassword, firestore } = useFirebase()
  const { handleCloseForm } = useDialogCtx()
  async function formSubmit(values) {
    const { email, password, displayName, avatarNumber } = values
    const authUser = await doCreateUserWithEmailAndPassword(
      email.trim(),
      password.trim()
    )

    firestore
      .collection("publicProfiles")
      .doc(authUser.user.uid)
      .set({
        email: email.trim(),
        displayName: displayName.trim(),
        avatarNumber
      })
    handleCloseForm()
  }
  function validate(values) {
    const { password, passwordConf, email, avatarNumber } = values
    const errors = {}
    if (!email) errors.email = "Email Required"
    if (!password) errors.password = "Password Required"
    if (!passwordConf) errors.passwordConf = "Password Confirmation Required"
    if (!avatarNumber) errors.avatarNumber = "Choose a monster!"
    if (password && passwordConf && password !== passwordConf)
      errors.passwordConf = "Passwords must match!"
    return errors
  }
  return (
    <Form validate={validate} onSubmit={formSubmit}>
      {({ handleSubmit, values, hasValidationErrors, submitErrors }) => {
        return (
          <StyledForm onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} className="center">
                <AvatarMonster num={values.avatarNumber} />
                <Typography variant="subtitle1">
                  {values.displayName || "SIGN UP"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormTextInput name="email" label="Email" type="email" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormTextInput
                  name="password"
                  label="Password"
                  type="password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormTextInput
                  name="passwordConf"
                  label="Password Confirmation"
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextInput name="displayName" label="Display Name" />
              </Grid>
              <Grid item xs={12}>
                <ChooseAvatar />
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
