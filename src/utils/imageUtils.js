export const removeUid = itemIdWithUid => {
  const [a, b, c, uid] = itemIdWithUid.split("_")
  const itemWithoutUid = [a, b, c].join("_")
  return itemWithoutUid
}
