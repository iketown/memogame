import alligator from "./alligator.svg"
import apple from "./apple.svg"
import ball from "./ball.svg"
import banana from "./banana.svg"
import beet from "./beet.svg"
import brain from "./brain.svg"
import carrot from "./carrot.svg"
import cucumber from "./cucumber.svg"
import doll from "./doll.svg"
import dolphin from "./dolphin.svg"
import dress from "./dress.svg"
import drum from "./drum.svg"
import eggplant from "./eggplant.svg"
import giraffe from "./giraffe.svg"
import grapes from "./grapes.svg"
import hat from "./hat.svg"
import lion from "./lion.svg"
import monkey from "./monkey.svg"
import octopus from "./octopus.svg"
import orange from "./orange.svg"
import pail from "./pail.svg"
import pants from "./pants.svg"
import pear from "./pear.svg"
import pepper from "./pepper.svg"
import potato from "./potato.svg"
import robot from "./robot.svg"
import shirt from "./shirt.svg"
import shoe from "./shoe.svg"
import strawberry from "./strawberry.svg"
import tie from "./tie.svg"
import train from "./train.svg"

const imageObject = {
  alligator,
  apple,
  ball,
  banana,
  beet,
  brain,
  carrot,
  cucumber,
  doll,
  dolphin,
  dress,
  drum,
  eggplant,
  giraffe,
  grapes,
  hat,
  lion,
  monkey,
  octopus,
  orange,
  pail,
  pants,
  pear,
  pepper,
  potato,
  robot,
  shirt,
  shoe,
  strawberry,
  tie,
  train
}
export default imageObject

const idMap = {
  RED_FRU_S: "strawberry",
  RED_VEG_B: "beet",
  YEW_VEG_P: "pepper",
  YEW_CLO_S: "shoe",
  BRN_CLO_H: "hat",
  RED_FRU_A: "apple",
  BLE_CLO_P: "pants",
  ORE_VEG_C: "carrot",
  ORE_FRU_O: "orange",
  GRN_VEG_C: "cucumber",
  ORE_ANI_L: "lion",
  PUE_ANI_O: "octopus",
  GRN_FRU_P: "pear",
  YEW_FRU_B: "banana",
  BLE_ANI_D: "dolphin",
  YEW_ANI_G: "giraffe",
  GRN_ANI_A: "alligator",
  BRN_ANI_M: "monkey",
  PUE_FRU_G: "grapes",
  PUE_VEG_E: "eggplant",
  BRN_VEG_P: "potato",
  RED_TOY_T: "train",
  BLE_TOY_R: "robot",
  GRN_TOY_D: "doll",
  BRN_TOY_B: "ball",
  ORE_TOY_P: "pail",
  PUE_TOY_D: "drum",
  ORE_CLO_S: "shirt",
  RED_CLO_D: "dress",
  PUE_CLO_T: "tie"
}

export function imageFromItemId(itemId) {
  const [col, type, firstLetter, uid] = itemId.split("_")
  const stripId = [col, type, firstLetter].join("_")
  return imageObject[idMap[stripId]]
}

// get 'allItems' from somewhere and use this to create a new idMap if necc.
// const imageMap = Object.entries(allItems).reduce((obj, [itemId, item]) => {
//   const stripped = imageFromItemId(itemId)
//   obj[stripped] = item.name
//   return obj
// }, {})
