/* eslint-disable no-console */

import { nextLine, prevLine } from '../actions/navigateDocument'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import React from 'react'
import Row from 'react-bootstrap/Row'

const ITEMS_IN_VIEW = 4
const BEFORE_OR_AFTER = ITEMS_IN_VIEW >> 1

/**
* Creates the control for tagging a document
*
* @param {object} props the properties of the component
* @returns {string} the HTML to render
*/
class ActiveDocument extends React.Component {
  render() {
    const { doc, dispatch } = this.props;

    const { current } = doc;
    const last = doc.lines.length - 1
    let min, max
    let prevText = 'Previous'
    let nextText = 'Next'
    if ( current <= BEFORE_OR_AFTER ) {
      min = 0
      max = ITEMS_IN_VIEW
      nextText = `Next (${ last - max } more)`
    } else if ( current + BEFORE_OR_AFTER >= last ) {
      min = last - ITEMS_IN_VIEW
      max = last
      prevText = `Previous (${ min } more)`
    } else {
      min = current - BEFORE_OR_AFTER
      max = current + BEFORE_OR_AFTER
      prevText = `Previous (${ min } more)`
      nextText = `Next (${ last - max } more)`
    }

    const elements = doc.lines.map(
      ( x, i ) => <ListGroup.Item as="li"
                                  active={ i === current }
                                  key={i}>
                                  {x}
                  </ListGroup.Item>
    ).filter(
      ( _, i ) => i >= min && i <= max
    )

    return (
      <Container fluid>
        <Row className="justify-content-between" noGutters>
          <Col>
            { current > min &&
              <Button block onClick={ () => dispatch( prevLine() ) }>
              { prevText }
            </Button>}
          </Col>
          <Col />
          <Col>
            { current < last &&
              <Button block onClick={ () => dispatch( nextLine() ) }>
              { nextText }
            </Button>}
          </Col>
        </Row>
        <Row noGutters>
          <ListGroup as="ul">
            {elements}
          </ListGroup>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = state => ( { doc: state.document } )

export default connect( mapStateToProps )( ActiveDocument );
