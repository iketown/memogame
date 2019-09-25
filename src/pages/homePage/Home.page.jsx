import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { Typography, Grid, Container, Button } from "@material-ui/core"
import head from "../../images/BrainLoader/head.svg"
import CardSlider from "./CardSlider"
import YouTube from "react-youtube"

// const typeVariants = [
//   "body1",
//   "body2",
//   "button",
//   "caption",
//   "h1",
//   "h2",
//   "h3",
//   "h4",
//   "h5",
//   "inherit",
//   "overline",
//   "srOnly",
//   "subtitle1",
//   "subtitle2"
// ]

const BackgroundDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 10%;
  background-image: url(${head});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -2;
  ::after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffffdd;
    content: "";
    z-index: -1;
  }
`
const ContentDiv = styled.div`
  z-index: 2;
`

const Heading = ({ text, children }) => (
  <Typography variant="h5">{text || children}</Typography>
)
const Paragraph = ({ text, children }) => (
  <Typography gutterBottom variant="body1">
    {text || children}
  </Typography>
)
const Home = () => {
  return (
    <div>
      <BackgroundDiv></BackgroundDiv>
      <ContentDiv>
        <Container>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12}>
              <Typography variant="h3">MEMOGA.ME</Typography>
            </Grid>
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <YouTube videoId="eikx_TcBY7k" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Heading text="The Basics" />
                <Paragraph>
                  <em>MEMOGAME</em> is an online card game, borrowing elements
                  from Concentration and Gin Rummy.
                </Paragraph>
                <Paragraph>
                  The goal of <em>MEMOGAME</em> is to move all the cards from
                  your <em>STORAGE</em> pile into the <em>CENTER</em> pile. The
                  center pile is shared with the other players, who are also
                  trying to do the same with their cards. The game ends when any
                  player gets all their cards into the center.
                </Paragraph>
                <Paragraph>
                  To play a card, it has to MATCH the card that’s already there.
                  Cards can match in any of three ways: <em>Color</em>,{" "}
                  <em>Type</em> or <em>First Letter</em>.
                </Paragraph>
                <CardSlider />
              </Grid>
              <Grid item xs={12} md={6}>
                <Paragraph>
                  If your top card doesn't match the center card, you can put it
                  into a room in your house.
                </Paragraph>
                <Heading text="Your House" />
                <Paragraph>
                  There are SIX rooms in your house;{" "}
                  <em>Bedroom, Bathroom, Kitchen, Dining, Garage and Office</em>
                  . Each room can hold up to THREE cards. Once a card goes into
                  a room it remains there <em>face-down</em> until you play it
                  to the center.
                </Paragraph>
                <Paragraph>
                  The only times you get to see cards in your house face-up are:
                  <br />
                  <b>1.</b> when adding another card to a room (you get a few
                  seconds to reorganize the room) and <br />
                  <b>2.</b> by "peeking" at it, which costs you a point each
                  time.
                </Paragraph>
                <Heading>Play</Heading>
                <Paragraph>
                  For the most part, you'll be playing cards from your house{" "}
                  <em>from memory.</em> You can play a (face-down) card from
                  your house at any time, even when it is not your turn. Be
                  careful though, because if you play a card that{" "}
                  <em>doesn't match</em>, the entire center pile gets shuffled
                  to the bottom of your storage pile. (that's bad).
                </Paragraph>
                <Heading>Bonus Points</Heading>
                <Paragraph>
                  Each consecutive card you play from the house makes the
                  points-per-card value <em>climb</em>. So playing three cards
                  in a row from your house would get you{" "}
                  <em>
                    1 + 2 + 3 = <b>6</b>
                  </em>{" "}
                  points. Peeking or playing a card from your storage pile
                  resets that point climber.
                </Paragraph>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Heading>Scoring</Heading>
              <Paragraph>
                When a player "goes out" by moving all their cards from their
                storage pile and house into the center, the game ends. Each of
                the players who still had cards left must <em>subtract</em>{" "}
                those cards from their score, and the player who went out{" "}
                <em>adds</em> all those points to his/her score.
              </Paragraph>
              <Heading>Ready to try?</Heading>
              <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                <Link to="/gamestart">
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    color="primary"
                    style={{ maxWidth: "16rem" }}
                  >
                    Start a game
                  </Button>
                </Link>
              </div>
            </Grid>
          </Grid>
        </Container>
      </ContentDiv>
    </div>
  )
  //   return (
  //     <Grid container spacing={2}>
  //       {typeVariants.map(variant => {
  //         return (
  //           <Grid key={variant} item xs={12}>
  //             <Typography variant={variant}>I am {variant} HELLO</Typography>
  //           </Grid>
  //         )
  //       })}
  //     </Grid>
  //   )
}

export default Home
