import React from "react"
import { useDialogCtx } from "./DialogCtx"
import { Dialog, DialogContent } from "@material-ui/core"
import ShowMe from "../utils/ShowMe.jsx"
import SignUpForm from "../components/form/SignUpForm.jsx"
import SignInForm from "../components/form/SignInForm"
import EditProfile from "../components/form/EditProfile.jsx"
import ResetPasswordForm from "../components/form/ResetPasswordForm"

//
//
function getContent(formType) {
  switch (formType) {
    case "signUp":
      return <SignUpForm />
    case "signIn":
      return <SignInForm />
    case "resetPassword":
      return <ResetPasswordForm />
    case "editProfile":
      return <EditProfile />
    default:
      return <div>no formtype</div>
  }
}
const DialogContainer = () => {
  const { state, dispatch, handleCloseForm } = useDialogCtx()
  const { formOpen, formType, maxWidth = "md", fullWidth = true } = state

  return (
    <Dialog
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      open={formOpen}
      onClose={handleCloseForm}
    >
      <DialogContent>
        {/* 👇👇👇👇 */}
        {getContent(formType)}
        {/* 👆👆👆👆 */}
        {/* <ShowMe obj={state} name="state" noModal /> */}
      </DialogContent>
    </Dialog>
  )
}

export default DialogContainer
