import React, { useState } from "react"
import { Item } from "./resources/Item"
import ShowMe from "./utils/ShowMe.jsx"
import { TextField, Button, Container, Grid } from "@material-ui/core"
import ItemView from "./components/ItemView"
import AttributeForm from "./components/AttributeForm.jsx"
import NavBar from "./components/NavBar"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { AttrCtxProvider } from "./contexts/AttrContext"
import { ItemCtxProvider } from "./contexts/ItemContext"
import { DialogCtxProvider } from "./contexts/DialogCtx"
import { FirebaseCtxProvider } from "./contexts/FirebaseCtx"
import { AuthCtxProvider } from "./contexts/AuthCtx"
import DialogContainer from "./contexts/DialogContainer.jsx"
import ItemForm from "./components/ItemForm"
import ItemPage from "./pages/Items.page.jsx"
import Cards from "./pages/Cards.page"
import DragTest from "./pages/DragTest.page"
import House from "./components/house/House"
//
//
const App = () => {
  return (
    <Router>
      <FirebaseCtxProvider>
        <AuthCtxProvider>
          <AttrCtxProvider>
            <ItemCtxProvider>
              <DialogCtxProvider>
                <DialogContainer />
                <NavBar />
                <Container>
                  <div style={{ marginTop: "5rem" }} />
                  <Route path="/attributes" component={AttributeForm} />
                  <Route path="/items" component={ItemPage} />
                  <Route path="/allCards" component={Cards} />
                  <Route path="/dragTest" component={DragTest} />
                  <Route path="/house" component={House} />
                </Container>
              </DialogCtxProvider>
            </ItemCtxProvider>
          </AttrCtxProvider>
        </AuthCtxProvider>
      </FirebaseCtxProvider>
    </Router>
  )
}

export default App
