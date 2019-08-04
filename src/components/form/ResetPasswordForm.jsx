import React, { useState } from "react"
import { TextField, Grid, Typography, Button } from "@material-ui/core"
import { FaUser } from "react-icons/fa"
import styled from "styled-components"
import { useFirebase } from "../../contexts/FirebaseCtx"
//
//
const StyledGrid = styled(Grid)`
  text-align: center;
`
const ResetPasswordForm = () => {
  const { doPasswordReset } = useFirebase()
  const [email, setEmail] = useState("")
  function handleReset() {
    console.log("email", email)
    doPasswordReset(email)
  }
  return (
    <StyledGrid container spacing={2}>
      <Grid item xs={12}>
        <FaUser />
        <Typography variant="subtitle1">Reset Password</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={email}
          onChange={e => setEmail(e.target.value)}
          label="Email"
        />
      </Grid>
      <Grid item xs={12}>
        <Button onClick={handleReset}>reset</Button>
      </Grid>
    </StyledGrid>
  )
}

export default ResetPasswordForm
