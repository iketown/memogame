import React, { useEffect } from "react"
import { Button } from "@material-ui/core"

const AutoCloseButton = ({ timeLeft, start, handleCloseRoom }) => {
  //   const [timeLeft, start] = useCountDown(initialTime, 1000)

  return <Button onClick={handleCloseRoom}>CLOSING IN {timeLeft / 1000}</Button>
}

export default AutoCloseButton
