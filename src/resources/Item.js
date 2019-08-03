export class Item {
  constructor(name) {
    this.name = name
    this.attributes = {}
  }
  addAttribute({ type, attr }) {
    this.attributes[type] = attr
  }
  save() {
    const jsonAttrs = JSON.stringify(this.attributes)
    localStorage.setItem(this.name, jsonAttrs)
  }
}
