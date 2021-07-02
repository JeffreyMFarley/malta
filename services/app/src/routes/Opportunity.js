import ActiveDocument from '../components/ActiveDocument'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import React from 'react'
import Row from 'react-bootstrap/Row'
import TagPanel from '../components/TagPanel'

/**
* renders the Opportunity component
*
* @returns {string} the HTML to render
*/
function Opportunity() {
  return (
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
  )
}

export default Opportunity;
