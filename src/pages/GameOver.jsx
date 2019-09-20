import React from "react"
import styled from "styled-components"
import { Typography, Button } from "@material-ui/core"
import AvatarMonster from "../components/AvatarMonster"
import greenCircle from "../images/greenCircle.svg"
import { useGameCtx } from "../contexts/GameCtx"
import { useAuthCtx } from "../contexts/AuthCtx"
import ShowMe from "../utils/ShowMe.jsx"
import { useFirebase } from "../contexts/FirebaseCtx"

const FullPage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const getGameScores = ({ gamePlay, players }) => {
  const { gameStates = {} } = gamePlay
  let scores
  if (players && gameStates) {
    scores = Object.entries(gameStates).map(([uid, state]) => {
      const displayName = players[uid] && players[uid].displayName
      const avatarNumber = players[uid] && players[uid].avatarNumber
      const { points, storagePile, house } = state
      const cardsLeft = []
      if (storagePile) cardsLeft.push(...storagePile)
      if (house) Object.values(house).forEach(room => cardsLeft.push(...room))
      return {
        uid,
        displayName,
        avatarNumber,
        points,
        cardsLeft: -cardsLeft.length,
        adjScore: points - cardsLeft.length
      }
    })
  } else return "missing players or gameStates"
  const bonusPoints = scores.reduce((sum, { cardsLeft }) => {
    sum -= cardsLeft
    return sum
  }, 0)
  const scoresWithBonus = scores.map(score => {
    if (score.cardsLeft === 0) {
      score.adjScore = score.points + bonusPoints
      score.cardsLeft = bonusPoints
    }
    return score
  })
  const sortedWithBonus = scoresWithBonus.sort((a, b) =>
    a.adjScore > b.adjScore ? -1 : 1
  )
  return sortedWithBonus
}

const ScoreBoard = styled.div`
  display: grid;
  grid-template-columns: [winner-start] 1fr [winner-end] repeat(
      ${p => p.players - 1},
      1fr
    );
  grid-template-rows: [avatar-start] 1fr [name-start] 1fr [score-start] 1fr [cards-start] 1fr [adjscore-start] 1fr [];
  column-gap: 2rem;
  justify-items: center;
  .avatar {
    grid-row: avatar / span 1;
  }
  .name {
    grid-row: name / span 1;
  }
  .score {
    grid-row: score / span 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .cards {
    grid-row: cards / span 1;
  }
  .adjScore {
    grid-row: adjscore / span 1;
    position: relative;
  }
  .green-circle {
    background-image: url(${greenCircle});
    background-size: contain;
    position: absolute;
    top: -11px;
    left: -25px;
    bottom: -25px;
    right: -25px;
    background-position: center;
    background-repeat: no-repeat;
  }
  * {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
  }
`

const GameOver = () => {
  const { gameState } = useGameCtx()
  const { user } = useAuthCtx()
  const { doProposeGame } = useFirebase()
  const scores = gameState && gameState.scores
  const youWon = scores[0].uid === user.uid
  function handleProposeRematch() {
    console.log("gameState in rematch", gameState)
    // const {} = await doProposeGame({gameName: gameState.gameName })
  }
  return (
    <FullPage>
      <Typography gutterBottom variant="h3">
        GAME OVER
      </Typography>
      <ScoreBoard players={scores.length}>
        {scores &&
          scores.map((player, index) => {
            return (
              <>
                <AvatarMonster className="avatar" num={player.avatarNumber} />
                <div className="name">{player.displayName}</div>
                <div className="score">
                  <Typography variant="h4">{player.points}</Typography>{" "}
                  <Typography variant="caption">pts</Typography>
                </div>
                <div
                  className="cards"
                  style={{ color: player.cardsLeft >= 0 ? "green" : "red" }}
                >
                  <Typography variant="h4">{player.cardsLeft}</Typography>{" "}
                  <Typography variant="caption">
                    {player.cardsLeft >= 0 ? "bonus" : "cards"}
                  </Typography>
                </div>
                <div className="adjScore">
                  {index === 0 && <div className="green-circle"></div>}
                  <Typography variant="h4">{player.adjScore}</Typography>{" "}
                  <Typography variant="caption">TOTAL</Typography>
                </div>
              </>
            )
          })}
      </ScoreBoard>
      <div style={{ height: "3rem" }}></div>
      {youWon && (
        <Button
          onClick={handleProposeRematch}
          variant="contained"
          color="primary"
        >
          REMATCH
        </Button>
      )}
      {youWon && "YOU WON"}
      {/* <div>
        <ShowMe obj={scores} name="scores" noModal />
      </div> */}
    </FullPage>
  )
}

export default GameOver
