import 'bootstrap/dist/css/bootstrap.min.css'
import './App.less'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { LinkContainer } from 'react-router-bootstrap'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Opportunity from './routes/Opportunity'
import React from 'react'
import Row from 'react-bootstrap/Row'

/**
* renders the App component
*
* @returns {string} the HTML to render
*/
function App() {
  return (
    <BrowserRouter>
      <Container id="App" fluid>
        <Row as="header" className="px-3">
          <Navbar bg="light" expand="lg">
            <Navbar.Brand>Malta</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <LinkContainer to="/portfolio">
                  <Button variant="light">Portfolio</Button>
                </LinkContainer>
                <LinkContainer to="/opportunities">
                  <Button variant="light">Opportunities</Button>
                </LinkContainer>
                <LinkContainer to="/match">
                  <Button variant="light">Match</Button>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Row>
        <Switch>
          <Route path="/portfolio">
            <Row><h1>Portfolio</h1></Row>
          </Route>
          <Route path="/opportunities">
            <Opportunity />
          </Route>
          <Route path="/match">
            <Row><h1>Match</h1></Row>
          </Route>
          <Route path="/">
            <Redirect to="/opportunities" />
          </Route>
        </Switch>
        <Row as="footer">footer</Row>
      </Container>
    </BrowserRouter>
  )
}

export default App;
