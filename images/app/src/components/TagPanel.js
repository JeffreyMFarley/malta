import Button from 'react-bootstrap/Button'
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
      <Row class="justify-content-between" noGutters>
        <Col><h4>Tags</h4></Col>
        <Col xs={2}>
          <Button block size="sm" variant="light">+ Area</Button>
        </Col>
      </Row>
      <Row noGutters>
        { dimensions.map( x =>
          Object.keys( x ).map( k =>
            <TagDimension label={k} children={x[k]} key={k} />
          )
        ) }
      </Row>
    </Container>
  )
}

const mapStateToProps = state => ( { dimensions: state.tags.dimensions } )

export default connect( mapStateToProps )( TagPanel );
