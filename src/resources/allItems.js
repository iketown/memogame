import {
  airplane,
  alligator,
  apple,
  banana,
  bird,
  boat,
  car,
  carrot,
  dolphin,
  dress,
  grapes,
  glasses,
  goldfish,
  hat,
  lion,
  monkey,
  motorcycle,
  octopus,
  pants,
  potato,
  shirt,
  shoe,
  spinach,
  tie,
  train,
  truck
} from "../images/newCards"

const allItems = {
  ORE_TRA_A: {
    id: "ORE_TRA_A",
    firstLetter: "A",
    color__id: "orange",
    type__id: "transportation",
    name: "airplane",
    card: airplane
  },

  ORE_CLO_S: {
    id: "ORE_CLO_S",
    firstLetter: "S",
    color__id: "orange",
    type__id: "clothes",
    name: "shirt",
    card: shirt
  },

  ORE_ANI_L: {
    id: "ORE_ANI_L",
    firstLetter: "L",
    color__id: "orange",
    type__id: "animals",
    name: "lion",
    card: lion
  },
  ORE_PRO_C: {
    id: "ORE_PRO_C",
    firstLetter: "C",
    color__id: "orange",
    type__id: "produce",
    name: "carrot",
    card: carrot
  },

  YEW_TRA_M: {
    id: "YEW_TRA_M",
    firstLetter: "M",
    color__id: "yellow",
    type__id: "transportation",
    name: "motorcycle",
    card: motorcycle
  },

  YEW_CLO_S: {
    id: "YEW_CLO_S",
    firstLetter: "S",
    color__id: "yellow",
    type__id: "clothes",
    name: "shoe",
    card: shoe
  },

  YEW_PRO_B: {
    id: "YEW_PRO_B",
    firstLetter: "B",
    color__id: "yellow",
    type__id: "produce",
    name: "banana",
    card: banana
  },
  YEW_ANI_G: {
    id: "YEW_ANI_G",
    firstLetter: "G",
    color__id: "yellow",
    type__id: "animal",
    name: "fish",
    card: goldfish
  },

  RED_TRA_C: {
    id: "RED_TRA_C",
    firstLetter: "C",
    color__id: "red",
    type__id: "transportation",
    name: "car",
    card: car
  },
  RED_CLO_D: {
    id: "RED_CLO_D",
    firstLetter: "D",
    color__id: "red",
    type__id: "clothes",
    name: "dress",
    card: dress
  },

  RED_ANI_B: {
    id: "RED_ANI_B",
    firstLetter: "B",
    color__id: "red",
    type__id: "animals",
    name: "bird",
    card: bird
  },
  RED_PRO_A: {
    id: "RED_PRO_A",
    firstLetter: "A",
    color__id: "red",
    type__id: "produce",
    name: "apple",
    card: apple
  },

  GRN_TRA_B: {
    id: "GRN_TRA_B",
    firstLetter: "B",
    color__id: "green",
    type__id: "transportation",
    name: "boat",
    card: boat
  },

  GRN_CLO_G: {
    id: "GRN_CLO_G",
    firstLetter: "G",
    color__id: "green",
    type__id: "clothes",
    name: "glasses",
    card: glasses
  },
  GRN_ANI_A: {
    id: "GRN_ANI_A",
    firstLetter: "A",
    color__id: "green",
    type__id: "animals",
    name: "alligator",
    card: alligator
  },
  GRN_PRO_S: {
    id: "GRN_PRO_S",
    firstLetter: "S",
    color__id: "green",
    type__id: "produce",
    name: "spinach",
    card: spinach
  },

  GRY_TRA_T: {
    id: "GRY_TRA_T",
    firstLetter: "T",
    color__id: "grey",
    type__id: "transportation",
    name: "train",
    card: train
  },

  GRY_CLO_P: {
    id: "GRY_CLO_P",
    firstLetter: "P",
    color__id: "grey",
    type__id: "clothes",
    name: "pants",
    card: pants
  },

  GRY_ANI_D: {
    id: "GRY_ANI_D",
    firstLetter: "D",
    color__id: "grey",
    type__id: "animal",
    name: "dolphin",
    card: dolphin
  },

  PUE_CLO_T: {
    id: "PUE_CLO_T",
    firstLetter: "T",
    color__id: "purple",
    type__id: "clothes",
    name: "tie",
    card: tie
  },

  PUE_ANI_O: {
    id: "PUE_ANI_O",
    firstLetter: "O",
    color__id: "purple",
    type__id: "animal",
    name: "octopus",
    card: octopus
  },
  PUE_PRO_G: {
    id: "PUE_PRO_G",
    firstLetter: "G",
    color__id: "purple",
    type__id: "produce",
    name: "grapes",
    card: grapes
  },

  BRN_TRA_T: {
    id: "BRN_TRA_T",
    firstLetter: "T",
    color__id: "brown",
    type__id: "transportation",
    name: "truck",
    card: truck
  },

  BRN_CLO_H: {
    id: "BRN_CLO_H",
    firstLetter: "H",
    color__id: "brown",
    type__id: "clothes",
    name: "hat",
    card: hat
  },

  BRN_ANI_M: {
    id: "BRN_ANI_M",
    firstLetter: "M",
    color__id: "brown",
    type__id: "animal",
    name: "monkey",
    card: monkey
  },
  BRN_PRO_P: {
    id: "BRN_PRO_P",
    firstLetter: "P",
    color__id: "brown",
    type__id: "produce",
    name: "potato",
    card: potato
  }
}

export default allItems

export const removeUid = itemIdWithUid => {
  const [a, b, c] = itemIdWithUid.split("_")
  const itemWithoutUid = [a, b, c].join("_")
  return itemWithoutUid
}

export const itemFromItemId = itemId => {
  const strippedId = removeUid(itemId)
  return allItems[strippedId]
}
