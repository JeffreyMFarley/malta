import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import PropTypes from 'prop-types';
import React from 'react'
import Row from 'react-bootstrap/Row'
import TagGroup from './TagGroup';

export default class TagDimension extends React.Component {

  render() {
    const { children, label, path } = this.props;
    const groups = children.map( ( x, i ) =>
      Object.keys( x ).map( k =>
        <TagGroup label={k}
                  children={x[k]}
                  path={ [ ...path, i, k ] }
                  key={k} />
      )
    )

    return (
      <Container className="px-0">
        <Row className="justify-content-between pt-3 mb-2 border-bottom border-4"
             noGutters>
          <Col><h5>{label}</h5></Col>
          <Col xs={3}>
            <Button block size="sm" variant="light">+ Group</Button>
          </Col>
        </Row>
        { groups }
      </Container>
    );
  }
}

// --------------------------------------------------------------------------
// Meta

TagDimension.propTypes = {
  children: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  path: PropTypes.array.isRequired
}

TagDimension.defaultProps = {
}
