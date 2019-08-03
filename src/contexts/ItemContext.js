import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from "react"
//
import { getAllItems, saveItem, deleteItem } from "../utils/ItemLocalStorage"
import { useAttrCtx } from "./AttrContext"

const ItemCtx = createContext()

export const ItemCtxProvider = props => {
  const [allItems, setAllItems] = useState({})
  const { allAttrs } = useAttrCtx()
  const [selectedItem, setSelectedItem] = useState()
  const itemsAttrsObj = useMemo(() => {
    return getItemAttrsObj({ allItems, allAttrs })
  }, [allItems, allAttrs])

  function refreshAllItems() {
    const _allItems = getAllItems()
    console.log("_allItems", _allItems)
    setAllItems(_allItems)
  }
  useEffect(() => {
    refreshAllItems()
  }, [])
  function handleSelectItem(itemId) {
    setSelectedItem(itemId)
  }
  function handleSaveItem(item) {
    saveItem(item)
    refreshAllItems()
  }
  function handleDeleteItem(itemId) {
    deleteItem(itemId)
    refreshAllItems()
  }
  const value = {
    allItems,
    saveItem: handleSaveItem,
    deleteItem: handleDeleteItem,
    itemsAttrsObj,
    handleSelectItem,
    selectedItem
  }
  return <ItemCtx.Provider value={value} {...props} />
}

export const useItemCtx = () => {
  const ctx = useContext(ItemCtx)
  if (!ctx)
    throw new Error("useAttrCtx must be a descendant of ItemCtxProvider 😕")
  const {
    allItems,
    saveItem,
    deleteItem,
    itemsAttrsObj,
    handleSelectItem,
    selectedItem
  } = ctx
  return {
    allItems,
    saveItem,
    deleteItem,
    itemsAttrsObj,
    handleSelectItem,
    selectedItem
  }
}

function getItemAttrsObj({ allItems, allAttrs }) {
  const itemsAttrsObj = Object.entries(allAttrs) // all available attributes
    .reduce((obj, [attrId, { options, name }]) => {
      obj[attrId] = { name } // name of this attribute.  ex. "Type" or "Color"
      Object.entries(options).forEach(([optId, opt]) => {
        // each of the options available for this attr.  "Animal, Toy, etc" or "Blue, Brown, Grey"
        const itemsWithThisOption = Object.values(allItems).filter(
          item => item[attrId] === optId
        ) // only items which have this selected option
        obj[attrId][optId] = { text: opt.text, items: itemsWithThisOption } // a list of each item with this same quality.  everything that is "Brown" for example.
      })
      return obj
    }, {})
  itemsAttrsObj.firstLetter = { name: "First Letter" }
  Object.values(allItems).forEach(item => {
    if (itemsAttrsObj.firstLetter[item.firstLetter]) {
      itemsAttrsObj.firstLetter[item.firstLetter].items.push({
        id: item.id,
        name: item.name
      })
    } else {
      itemsAttrsObj.firstLetter[item.firstLetter] = {
        text: item.firstLetter,
        items: [{ id: item.id, name: item.name }]
      }
    }
  })
  console.log("getItemAttrsobj", itemsAttrsObj)
  return itemsAttrsObj
}

// const targetObj = {
//   attr_0001: {
//     name: "Color",
//     opt_01: { name: "Brown", items: ["itemId001", "itemId002"] },
//     opt_02: { name: "Green", items: [] },
//     opt_03: { name: "Yellow", items: ["itemId003"] }
//   }
// }
