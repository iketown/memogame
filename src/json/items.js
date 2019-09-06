import {
  airplane,
  alligator,
  apple,
  ball,
  banana,
  banjo,
  bird,
  boat,
  calculator,
  car,
  carrot,
  desk,
  doll,
  dolphin,
  dress,
  drum,
  grapes,
  glasses,
  goldfish,
  guitar,
  hat,
  lion,
  maracas,
  monkey,
  motorcycle,
  octopus,
  pail,
  pants,
  paperclip,
  pencil,
  piano,
  potato,
  robot,
  ruler,
  shirt,
  shoe,
  spinach,
  stapler,
  tie,
  train,
  truck,
  trumpet
} from "../images/newCards"

const items = {
  ORE_TRA_A: {
    id: "ORE_TRA_A",
    firstLetter: "A",
    color__id: "orange",
    type__id: "transportation",
    name: "airplane",
    card: airplane
  },
  // ORE_SCH_R: {
  //   id: "ORE_SCH_R",
  //   firstLetter: "R",
  //   color__id: "orange",
  //   type__id: "school",
  //   name: "ruler",
  //   card: ruler
  // },
  ORE_CLO_S: {
    id: "ORE_CLO_S",
    firstLetter: "S",
    color__id: "orange",
    type__id: "clothes",
    name: "shirt",
    card: shirt
  },
  // ORE_MUS_M: {
  //   id: "ORE_MUS_M",
  //   firstLetter: "M",
  //   color__id: "orange",
  //   type__id: "music",
  //   name: "maracas",
  //   card: maracas
  // },
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
  // YELLOW
  YEW_TRA_M: {
    id: "YEW_TRA_M",
    firstLetter: "M",
    color__id: "yellow",
    type__id: "transportation",
    name: "motorcycle",
    card: motorcycle
  },
  // YEW_SCH_P: {
  //   id: "YEW_SCH_P",
  //   firstLetter: "P",
  //   color__id: "yellow",
  //   type__id: "school",
  //   name: "pencil",
  //   card: pencil
  // },
  YEW_CLO_S: {
    id: "YEW_CLO_S",
    firstLetter: "S",
    color__id: "yellow",
    type__id: "clothes",
    name: "shoe",
    card: shoe
  },
  // YEW_MUS_T: {
  //   id: "YEW_MUS_T",
  //   firstLetter: "T",
  //   color__id: "yellow",
  //   type__id: "music",
  //   name: "trumpet",
  //   card: trumpet
  // },
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
  // YEW_TOY_B: {
  //   id: "YEW_TOY_B",
  //   firstLetter: "B",
  //   color__id: "yellow",
  //   type__id: "toys",
  //   name: "ball",
  //   card: ball
  // },
  // RED
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
  // RED_MUS_P: {
  //   id: "RED_MUS_P",
  //   firstLetter: "P",
  //   color__id: "red",
  //   type__id: "music",
  //   name: "piano",
  //   card: piano
  // },
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
  // GREEN
  GRN_TRA_B: {
    id: "GRN_TRA_B",
    firstLetter: "B",
    color__id: "green",
    type__id: "transportation",
    name: "boat",
    card: boat
  },
  // GRN_SCH_S: {
  //   id: "GRN_SCH_S",
  //   firstLetter: "S",
  //   color__id: "green",
  //   type__id: "school",
  //   name: "stapler",
  //   card: stapler
  // },
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
  // GRN_TOY_D: {
  //   id: "GRN_TOY_D",
  //   firstLetter: "D",
  //   color__id: "green",
  //   type__id: "toys",
  //   name: "doll",
  //   card: doll
  // },
  //grey
  GRY_TRA_T: {
    id: "GRY_TRA_T",
    firstLetter: "T",
    color__id: "grey",
    type__id: "transportation",
    name: "train",
    card: train
  },
  // GRY_SCH_C: {
  //   id: "GRY_SCH_C",
  //   firstLetter: "C",
  //   color__id: "grey",
  //   type__id: "school",
  //   name: "calculator",
  //   card: calculator
  // },
  GRY_CLO_P: {
    id: "GRY_CLO_P",
    firstLetter: "P",
    color__id: "grey",
    type__id: "clothes",
    name: "pants",
    card: pants
  },
  // GRY_MUS_B: {
  //   id: "GRY_MUS_B",
  //   firstLetter: "B",
  //   color__id: "grey",
  //   type__id: "music",
  //   name: "banjo",
  //   card: banjo
  // },
  GRY_ANI_D: {
    id: "GRY_ANI_D",
    firstLetter: "D",
    color__id: "grey",
    type__id: "animal",
    name: "dolphin",
    card: dolphin
  },
  // GRY_TOY_R: {
  //   id: "GRY_TOY_R",
  //   firstLetter: "R",
  //   color__id: "grey",
  //   type__id: "toy",
  //   name: "robot",
  //   card: robot
  // },
  // PURPLE
  // PUE_SCH_P: {
  //   id: "PUE_SCH_P",
  //   firstLetter: "P",
  //   color__id: "purple",
  //   type__id: "school",
  //   name: "paperclip",
  //   card: paperclip
  // },
  PUE_CLO_T: {
    id: "PUE_CLO_T",
    firstLetter: "T",
    color__id: "purple",
    type__id: "clothes",
    name: "tie",
    card: tie
  },
  // PUE_MUS_D: {
  //   id: "PUE_MUS_D",
  //   firstLetter: "D",
  //   color__id: "purple",
  //   type__id: "music",
  //   name: "drum",
  //   card: drum
  // },
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
  // PUE_TOY_P: {
  //   id: "PUE_TOY_P",
  //   firstLetter: "P",
  //   color__id: "purple",
  //   type__id: "toys",
  //   name: "pail",
  //   card: pail
  // },
  //BROWN
  BRN_TRA_T: {
    id: "BRN_TRA_T",
    firstLetter: "T",
    color__id: "brown",
    type__id: "transportation",
    name: "truck",
    card: truck
  },
  // BRN_SCH_D: {
  //   id: "BRN_SCH_D",
  //   firstLetter: "D",
  //   color__id: "brown",
  //   type__id: "school",
  //   name: "desk",
  //   card: desk
  // },
  BRN_CLO_H: {
    id: "BRN_CLO_H",
    firstLetter: "H",
    color__id: "brown",
    type__id: "clothes",
    name: "hat",
    card: hat
  },
  // BRN_MUS_G: {
  //   id: "BRN_MUS_G",
  //   firstLetter: "G",
  //   color__id: "brown",
  //   type__id: "music",
  //   name: "guitar",
  //   card: guitar
  // },
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

export default items
