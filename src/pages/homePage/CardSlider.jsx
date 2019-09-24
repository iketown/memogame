import React from "react"
import CarouselSlider from "react-carousel-slider"

import carApple from "./carApple.svg"
import carTrain from "./carTrain.svg"
import trainTie from "./trainTie.svg"
import trainApple from "./trainApple.svg"
import { useWiderThan } from "../../hooks/useScreenSize"

const cardCompares = [
  {
    des: "Car and Apple are both color RED.",
    imgSrc: carApple
  },
  {
    des: "Car and Train are both of type TRANSPORTATION.",
    imgSrc: carTrain
  },
  {
    des: "Train and Tie both start with 'T'",
    imgSrc: trainTie
  },
  {
    des: "Train and Apple are NOT a match",
    imgSrc: trainApple
  }
]

let sliderBoxStyle = {
  maxWidth: "30rem",
  height: "16rem",
  background: "transparent",
  border: "1px solid #e1e4e8"
}

let itemsStyle = {
  height: "60%",
  padding: "0 10px 20px",
  background: "transparent"
  //   border: "1px solid #e1e4e8",
  //   borderRadius: "2px"
}

let textBoxStyle = {
  width: "60%",
  background: "rgba(155, 108, 27, 0.5)",
  top: "110%",
  textAlign: "right",
  color: "#ffffff"
}
let manner = {
  autoSliding: { interval: "4s" },
  duration: "1s"
}
let buttonSetting = {
  placeOn: "middle-inside",
  hoverEvent: true,
  style: {
    left: {
      height: "50px",
      width: "50px",
      color: "#929393",
      background: "rgba(225, 228, 232, 0.8)",
      borderRadius: "50%"
    },
    right: {
      height: "50px",
      width: "50px",
      color: "#929393",
      background: "rgba(225, 228, 232, 0.8)",
      borderRadius: "50%"
    }
  }
}

const CardSlider = () => {
  const smUp = useWiderThan("sm")
  console.log("smUp,", smUp)
  return (
    <CarouselSlider
      slideItems={cardCompares}
      sliderBoxStyle={sliderBoxStyle}
      itemsStyle={itemsStyle}
      textBoxStyle={textBoxStyle}
      manner={manner}
      buttonSetting={buttonSetting}
    />
  )
}

export default CardSlider
