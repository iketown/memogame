import { useState, useEffect } from "react"
import { useTheme } from "@material-ui/styles"
import { useMediaQuery } from "@material-ui/core"

export function useWidth() {
  const theme = useTheme()
  const keys = [...theme.breakpoints.keys].reverse()
  const currentSize =
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key))
      return !output && matches ? key : output
    }, null) || "xs"
  return currentSize
}

export function useWiderThan(txt) {
  const theme = useTheme()
  const keys = [...theme.breakpoints.keys].reverse()
  if (!txt || !keys.includes(txt))
    throw new Error(`useWiderThan must be called with ${keys.join(", ")}`)
  return useMediaQuery(theme => theme.breakpoints.up(txt))
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({})

  useEffect(() => {
    const isClient = typeof window === "object"
    function getSize() {
      return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
      }
    }
    if (!isClient) {
      return false
    }
    function handleResize() {
      setWindowSize(getSize())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const { height = 0, width = 0 } = windowSize

  function getHeightText() {
    switch (true) {
      case height < 670:
        return "short"
      case height >= 670 && height < 800:
        return "med"
      case height >= 800 && height < 900:
        return "tall"
      case height > 900:
        return "full"
      default:
        return "none"
    }
  }
  return { heightText: getHeightText() }
}
