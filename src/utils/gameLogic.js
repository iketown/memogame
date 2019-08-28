export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)) // random index from 0 to i
    ;[array[i], array[j]] = [array[j], array[i]] // swap elements
  }
}

export const doItemsMatch = (itemId1, itemId2) => {
  if (!itemId1 || !itemId2) {
    console.log(`zero or one items provided item1:${itemId1} item2:${itemId2}`)
    return { color: false, type: false, firstLetter: false }
  }
  const [color1, type1, let1] = itemId1.split("_")
  const [color2, type2, let2] = itemId2.split("_")
  const matches = { color: false, type: false, firstLetter: false }
  if (color1 === color2) matches.color = color1
  if (type1 === type2) matches.type = type1
  if (let1 === let2) matches.firstLetter = let1
  if (!!Object.values(matches).find(val => val)) return matches
  // if it is a match this will return an object showing the matches.
  return false
  // if it is NOT a match this will return false
}

export const maxItemsPerRoom = 3
