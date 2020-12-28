/* eslint-disable no-console */

import { nextLine, prevLine } from '../actions/navigateDocument'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import React from 'react'
import Row from 'react-bootstrap/Row'

/**
* Creates the control for tagging a document
*
* @param {object} props the properties of the component
* @returns {string} the HTML to render
*/
class ActiveDocument extends React.Component {
  render() {
    const { doc, dispatch } = this.props;

    const min = doc.current - 2;
    const max = doc.current + 2;

    const elements = doc.lines.map(
      ( x, i ) => <ListGroup.Item as="li"
                                  active={ i === doc.current }
                                  key={i}>
                                  {x}
                  </ListGroup.Item>
    ).filter(
      ( _, i ) => i >= min && i <= max
    )

    return (
      <Container>
        <Row>
          { min > 0 ? <Button onClick={ () => dispatch( prevLine() ) }>
            Previous ({min} more)
          </Button> : null}
        </Row>
        <Row>
          <ListGroup as="ul">
            {elements}
          </ListGroup>
        </Row>
        <Row>
          <Button onClick={ () => dispatch( nextLine() ) }>
            Next ({doc.lines.length - max} more)
          </Button>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = state => ( { doc: state.document } )

export default connect( mapStateToProps )( ActiveDocument );
