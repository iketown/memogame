import React, { useEffect, useState, useMemo, useRef } from "react"
import moment from "moment"

//
//
export const useTimer = ({ timeStart, secondsToWait, cbWhenTimeIsUp }) => {
  // this will count down to a target time, which is
  // timeStart + secondsToWait
  const [secondsLeft, setSecondsLeft] = useState(0)
  const endMoment = useMemo(() => {
    const _endMoment = moment(timeStart).add(secondsToWait, "seconds")
    console.log("endMoment", _endMoment.toISOString())
    return _endMoment
  }, [secondsToWait, timeStart])
  const intervalRef = useRef()
  useEffect(() => {
    if (moment().isBefore(endMoment)) {
      intervalRef.current = setInterval(() => {
        const _secondsLeft = Math.floor(endMoment.diff(moment()) / 1000)
        console.log("setting seconds left", _secondsLeft)
        setSecondsLeft(_secondsLeft)
      }, 1000)
    }
  }, [endMoment])
  useEffect(() => {
    if (secondsLeft <= 0) {
      clearInterval(intervalRef.current)
      setSecondsLeft(0)
    }
  }, [secondsLeft])
  if (!timeStart) return { secondsLeft: "nope" }
  console.log("updating secondsLeft", secondsLeft)
  return { secondsLeft }
}
