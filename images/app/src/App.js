import 'bootstrap/dist/css/bootstrap.min.css'
import './App.less'
import ActiveDocument from './components/ActiveDocument'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import React from 'react'
import Row from 'react-bootstrap/Row'
import TagPanel from './components/TagPanel'

/**
* renders the App component
*
* @returns {string} the HTML to render
*/
function App() {
  return (
    <Container id="App" fluid>
      <Row as="header" className="px-3"><h1>Malta</h1></Row>
      <Row as="main">
        <Col as="nav" xs={2}>
          <ListGroup as="ul" variant="flush">
            <ListGroup.Item as="li" active>Task Areas</ListGroup.Item>
            <ListGroup.Item as="li">Attachment #1</ListGroup.Item>
            <ListGroup.Item as="li">Attachment #2</ListGroup.Item>
            <ListGroup.Item as="li">Instructions</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col as="section" className="px-0"><ActiveDocument /></Col>
        <Col as="aside" xs={5} className="ps-0"><TagPanel /></Col>
      </Row>
      <Row as="footer">footer</Row>
    </Container>
  )
}

export default App;
