import { useState, useCallback } from "react"

export const useCallCounter = calledBy => {
  const [count, setCount] = useState(0)
  const incrementCallCounter = useCallback(() => {
    console.log("callCount", calledBy, count + 1)
    setCount(old => old + 1)
  })
  return { incrementCallCounter }
}
