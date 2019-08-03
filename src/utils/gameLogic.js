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
