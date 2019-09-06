import React from "react"
import styled from "styled-components"
import head from "../images/BrainLoader/head.svg"
import spinner from "../images/BrainLoader/spinnerGear.svg"
//
//
const RotateDiv = styled.div`
  @keyframes rotation {
    from {
      transform: rotate(359deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
  .rotate {
    animation: rotation 3s infinite linear;
  }
`
const Spinner = styled.div`
  background-image: url(${spinner});
  background-size: cover;
  height: 100%;
  width: 100%;
  grid-area: 2/2;
`
const Head = styled.div`
  height: 12rem;
  width: 10rem;
  background-image: url(${head});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: grid;
  grid-template-columns: 18fr 30fr 7fr;
  grid-template-rows: 2fr 10fr 10fr;
`
const AbsoluteDiv = styled.div`
  height: 100%;
  width: 100%;
  background: #ffffff82;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`
const SpinningPageLoader = () => {
  return (
    <AbsoluteDiv>
      <RotateDiv>
        <Head>
          <Spinner className="rotate"></Spinner>
        </Head>
      </RotateDiv>
    </AbsoluteDiv>
  )
}

export default SpinningPageLoader
