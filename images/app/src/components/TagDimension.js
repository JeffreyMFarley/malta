import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import PropTypes from 'prop-types';
import React from 'react'
import Row from 'react-bootstrap/Row'
import TagGroup from './TagGroup';

export default class TagDimension extends React.Component {

  render() {
    const { children, label } = this.props;
    const groups = children.map( x =>
      Object.keys( x ).map( k =>
        <TagGroup label={k} children={x[k]} key={k} />
      )
    )

    return (
      <Container className="px-0">
        <Row class="justify-content-between" noGutters>
          <Col><h6>{label}</h6></Col>
          <Col xs={2}>
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
  label: PropTypes.string.isRequired
}

TagDimension.defaultProps = {
}
