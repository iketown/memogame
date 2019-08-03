import shortid from "shortid"

export default class Attribute {
  constructor(name) {
    this.name = name
    this.id = shortid.generate()
    this.options = {}
  }
  addOption(option) {
    const optionId = shortid.generate()
    this.options[optionId] = option
  }
  setName(name) {
    this.name = name
  }
  save() {
    const allAttrsJson = localStorage.getItem("attributes")
    const allAttrs = JSON.parse(allAttrsJson) || {}
    allAttrs[this.id] = this.options
    const newAllAttrsJson = JSON.stringify(allAttrs)
    localStorage.setItem(`attributes`, newAllAttrsJson)
  }
  loadAll() {
    const allAttrsJson = localStorage.getItem(`attributes`)
    const allAttrs = JSON.parse(allAttrsJson) || {}
    return allAttrs
  }
}
