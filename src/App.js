import React from "react"
import { ThemeProvider } from "@material-ui/styles"
import { createMuiTheme } from "@material-ui/core/styles"
import styled from "styled-components"
import NavBar from "./components/NavBar"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { DialogCtxProvider } from "./contexts/DialogCtx"
import { FirebaseCtxProvider } from "./contexts/FirebaseCtx"
import { AuthCtxProvider } from "./contexts/AuthCtx"
import DialogContainer from "./contexts/DialogContainer.jsx"
import MyGames from "./pages/MyGames.page.jsx"
import GameStart from "./pages/gameStart/GameStart.page"
import GamePageResponsive from "./components/game/GamePage.responsive.jsx"
import SpinningPageLoader from "./components/SpinningPageLoader"
import HomePage from "./pages/homePage/Home.page"
import GameContainer from "./pages/GameContainer.jsx"
import GameOver from "./pages/GameOver.jsx"
//
//

const FullHeightContainer = styled.div`
  margin: 0 1rem;
  position: relative;
  height: calc(100vh - 47px);
  top: 0;
`

const theme = createMuiTheme()
const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <FirebaseCtxProvider>
          <AuthCtxProvider>
            <DialogCtxProvider>
              <DialogContainer />
              <NavBar />
              <FullHeightContainer>
                <Route exact path="/game/:gameId" component={GameContainer} />
                <Route path="/gameover/:gameId" component={GameOver} />
                <Route path="/mygames" component={MyGames} />
                <Route path="/gamestart" component={GameStart} />
                <Route path="/loader" component={SpinningPageLoader} />
                <Route path="/house" component={GamePageResponsive} />
                <Route exact path="/" component={HomePage} />
              </FullHeightContainer>
            </DialogCtxProvider>
          </AuthCtxProvider>
        </FirebaseCtxProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
