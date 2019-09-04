import { useTheme } from "@material-ui/styles"
import { useMediaQuery } from "@material-ui/core"

export function useWidth() {
  const theme = useTheme()
  const keys = [...theme.breakpoints.keys].reverse()
  console.log("keys", keys)
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
