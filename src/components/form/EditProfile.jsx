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
import ChooseAvatar from "./ChooseAvatar"
import AvatarMonster from "../AvatarMonster"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { useDialogCtx } from "../../contexts/DialogCtx"

//
//

const StyledHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
`
const EditProfile = () => {
  const { user, publicProfile } = useAuthCtx()
  const { firestore } = useFirebase()
  const { dispatch } = useDialogCtx()
  if (!user) return null

  const handleSubmit = async values => {
    const { displayName, email, avatarNumber } = values

    user.updateProfile({
      displayName,
      email
    })
    firestore
      .collection("publicProfiles")
      .doc(user.uid)
      .set(
        {
          email,
          displayName,
          avatarNumber
        },
        { merge: true }
      )
      .catch(err => console.error("error in profile", err))

    dispatch({ type: "CLOSE_FORM" })
  }

  return (
    <>
      <Form onSubmit={handleSubmit} initialValues={publicProfile || {}}>
        {({
          handleSubmit,
          values,
          hasValidationErrors,
          hasSubmitErrors,
          pristine,
          errors
        }) => (
          <>
            <StyledHeader>
              <AvatarMonster num={values.avatarNumber} />
              <DialogTitle>Edit Profile</DialogTitle>
            </StyledHeader>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormTextInput name="displayName" label="Display Name" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormTextInput name="email" label="Email" />
                </Grid>
                <Grid item xs={12}>
                  <ChooseAvatar />
                </Grid>

                <Grid container item xs={12}>
                  <ShowMe obj={values} name="values" />
                  <ShowMe obj={errors} name="errors" />
                </Grid>
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
