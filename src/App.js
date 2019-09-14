import React from "react"
import { Container } from "@material-ui/core"
import { ThemeProvider } from "@material-ui/styles"
import { createMuiTheme } from "@material-ui/core/styles"

import NavBar from "./components/NavBar"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { DialogCtxProvider } from "./contexts/DialogCtx"
import { FirebaseCtxProvider } from "./contexts/FirebaseCtx"
import { AuthCtxProvider } from "./contexts/AuthCtx"
import DialogContainer from "./contexts/DialogContainer.jsx"
import MyGames from "./pages/MyGames.page.jsx"
import GamePage from "./pages/Game.page.jsx"
import GameStart from "./pages/GameStart.page"
import GamePageResponsive from "./components/game/GamePage.responsive.jsx"
import { SnackbarProvider } from "notistack"
import SpinningPageLoader from "./components/SpinningPageLoader"
import GameContainer from "./pages/GameContainer.jsx"
import GameContent from "./components/game/GameContent.jsx"
//
//

const theme = createMuiTheme()
const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <SnackbarProvider dense preventDuplicate>
          <FirebaseCtxProvider>
            <AuthCtxProvider>
              <DialogCtxProvider>
                <DialogContainer />
                <NavBar />
                <Container>
                  <Route exact path="/game/:gameId" component={GameContainer} />

                  <Route path="/mygames" component={MyGames} />
                  <Route path="/gamestart" component={GameStart} />
                  <Route path="/loader" component={SpinningPageLoader} />
                  <Route path="/house" component={GamePageResponsive} />
                </Container>
              </DialogCtxProvider>
            </AuthCtxProvider>
          </FirebaseCtxProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
