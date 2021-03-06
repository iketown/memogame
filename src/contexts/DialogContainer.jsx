import React from "react"
import { useDialogCtx } from "./DialogCtx"
import { Dialog, DialogContent } from "@material-ui/core"
import SignUpForm from "../components/form/SignUpForm.jsx"
import SignInForm from "../components/form/SignInForm"
import EditProfile from "../components/form/EditProfile.jsx"
import ResetPasswordForm from "../components/form/ResetPasswordForm"
import PauseGameDialog from "../components/game/PauseGameDialog"
import SearchPlayers from "../pages/gameStart/SearchPlayers.jsx"
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
    case "pauseGame":
      return <PauseGameDialog />
    case "searchPlayers":
      return <SearchPlayers />
    default:
      return <div>no formtype</div>
  }
}
const DialogContainer = () => {
  const { state, handleCloseForm } = useDialogCtx()
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
