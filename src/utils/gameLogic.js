import { useItemCtx } from "../contexts/ItemContext"

export const useGameLogic = () => {
  const { allItems } = useItemCtx()
  const doTheyMatch = (itemId1, itemId2) => {
    if (!itemId1 || !itemId2) throw new Error("missing item", itemId1, itemId2)
    let match = false
    Object.entries(allItems[itemId1]).forEach(([attrId, optId]) => {
      if (allItems[itemId2][attrId] === optId) {
        match = true
      }
    })
    console.log("doTheyMatch ?", match)
    return match
  }

  return { doTheyMatch }
}

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)) // random index from 0 to i
    ;[array[i], array[j]] = [array[j], array[i]] // swap elements
  }
}

export const doItemsMatch = (itemId1, itemId2) => {
  if (!itemId1 || !itemId2) throw new Error("missing item", itemId1, itemId2)
  const [color1, type1, let1] = itemId1.split("_")
  const [color2, type2, let2] = itemId2.split("_")
  const matches = { color: false, type: false, firstLetter: false }
  if (color1 === color2) matches.color = color1
  if (type1 === type2) matches.type = type1
  if (let1 === let2) matches.firstLetter = let1
  if (!!Object.values(matches).find(val => val)) return matches // if any are true
  return false
}
