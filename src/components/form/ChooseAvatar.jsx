import React, { useState } from "react"
import { Avatar, Typography } from "@material-ui/core"
import styled from "styled-components"
import { Field } from "react-final-form"
//
//
const AvatarDiv = styled.div`
  width: 100%;
  overflow-x: auto;
  display: flex;
  .chooseAvatar {
  }
`
const ChooseAvatar = () => {
  const getRandoms = (length = 6) =>
    Array.from({ length }, () => Math.round(Math.random() * 100000))
  const [randomNums, setRandomNums] = useState(getRandoms(15))
  return (
    <Field name="avatarNumber">
      {({ input }) => {
        function handleClick(num) {
          input.onChange(num)
        }
        return (
          <div>
            <Typography variant="subtitle1" className="chooseAvatar">
              Choose an Avatar:
            </Typography>
            <AvatarDiv>
              {randomNums.map(num => (
                <AvatarOption
                  selected={input.value === num}
                  unselected={input.value && input.value !== num}
                  key={num}
                  handleClick={() => handleClick(num)}
                  num={num}
                />
              ))}
            </AvatarDiv>
          </div>
        )
      }}
    </Field>
  )
}

export default ChooseAvatar

const SelectedWrapper = styled.div`
  border: ${p => (p.selected ? "1px solid blue" : "none")};
  opacity: ${p => (p.unselected ? 0.4 : 1)};
`
const AvatarOption = ({ num, handleClick, selected, unselected }) => (
  <SelectedWrapper selected={selected} unselected={unselected}>
    <Avatar
      onClick={handleClick}
      style={{ marginRight: "4px" }}
      className="avatar"
      src={`https://api.adorable.io/avatars/95/${num}.png`}
    />
  </SelectedWrapper>
)
