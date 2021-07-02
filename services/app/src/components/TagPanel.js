import Button from 'react-bootstrap/Button'
import { coalesce } from '../utils'
import Col from 'react-bootstrap/Col'
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'
import TagDimension from './TagDimension';

/**
* Creates the top-level component to manage tags
*
* @param {object} props the properties of the component
* @returns {string} the HTML to render
*/
function TagPanel( { dimensions } ) {
  return (
    <Container className="px-0">
      <Row className="justify-content-between" noGutters>
        <Col><h4>Tags</h4></Col>
        <Col xs={3}>
          <Button block size="sm" variant="light">+ Area</Button>
        </Col>
      </Row>
      <Row noGutters>
        { dimensions.map( ( x, i ) =>
          Object.keys( x ).map( k =>
            <TagDimension label={k}
                          children={x[k]}
                          path={ [ i, k ] }
                          key={k} />
          )
        ) }
      </Row>
    </Container>
  )
}

const mapStateToProps = state => ( {
  dimensions: coalesce( state.tags, 'dimensions', [] )
} )

export default connect( mapStateToProps )( TagPanel );
