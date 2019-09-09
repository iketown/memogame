export function getBoxSize(heightText) {
  switch (heightText) {
    case "short":
      return 6
    case "med":
      return 7
    case "tall":
    case "full":
      return 8
    default:
      return 8
  }
}
