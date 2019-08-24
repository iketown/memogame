import React, { useState } from "react"
import { Avatar } from "@material-ui/core"
import styled from "styled-components"
import { Field } from "react-final-form"
//
//
const AvatarDiv = styled.div`
  width: 100%;
  overflow-x: auto;
  display: flex;
`
const ChooseAvatar = () => {
  const getRandoms = (length = 6) =>
    Array.from({ length }, () => Math.round(Math.random() * 100000))
  const [randomNums, setRandomNums] = useState(getRandoms(30))
  return (
    <Field name="avatarNumber">
      {({ input }) => {
        function handleClick(num) {
          input.onChange(num)
        }
        return (
          <AvatarDiv>
            {randomNums.map(num => (
              <AvatarOption
                selected={input.value === num}
                key={num}
                handleClick={() => handleClick(num)}
                num={num}
              />
            ))}
          </AvatarDiv>
        )
      }}
    </Field>
  )
}

export default ChooseAvatar

const SelectedWrapper = styled.div`
  ${p =>
    p.selected
      ? `
  border: 1px solid blue;
`
      : ``}
`
const AvatarOption = ({ num, handleClick, selected }) => (
  <SelectedWrapper selected={selected}>
    <Avatar
      selected={selected}
      onClick={handleClick}
      style={{ marginRight: "4px" }}
      className="avatar"
      src={`https://api.adorable.io/avatars/95/${num}.png`}
    />
  </SelectedWrapper>
)
