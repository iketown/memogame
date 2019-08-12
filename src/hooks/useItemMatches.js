import React, { useMemo } from "react"
import { useItemCtx } from "../contexts/ItemContext"
import { useAttrCtx } from "../contexts/AttrContext"

export const useItemMatches = item => {
  const { itemsAttrsObj } = useItemCtx()
  const { allAttrs } = useAttrCtx()
  const matchesObj = useMemo(() => {
    if (!item || !itemsAttrsObj || !allAttrs) return {}
    const { id, name, firstLetter, ...itemAttrs } = item
    const firstLetterItems = itemsAttrsObj.firstLetter[
      firstLetter
    ].items.filter(_item => _item.id !== item.id)
    let allMatchingItems = [...firstLetterItems]
    Object.entries(itemAttrs).forEach(([attrId, optId]) => {
      if (attrId === "matchId") return null
      const sharedItems = itemsAttrsObj[attrId][optId].items.filter(
        _item => _item.id !== item.id
      )
      allMatchingItems = [...allMatchingItems, ...sharedItems]
    })
    const _matchesObj = allMatchingItems.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {}) // no duplicates
    return _matchesObj
  }, [allAttrs, item, itemsAttrsObj])
  const matchesQuantity = Object.keys(matchesObj).length
  return { matchesObj, matchesQuantity }
}
