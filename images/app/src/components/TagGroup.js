import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Col from 'react-bootstrap/Col'
import PropTypes from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row'

export default class TagGroup extends React.Component {
  render() {
    const { children, label } = this.props;

    return (
      <Row noGutters>
        <Col xs="auto">
          <Button variant="secondary">{label}</Button>
        </Col>
        <Col xs="auto">
          <ButtonGroup>
            { children.map(
              x => <Button variant="outline-secondary">{x}</Button>
            ) }
          </ButtonGroup>
        </Col>
      </Row>
    );
  }
}

// --------------------------------------------------------------------------
// Meta

TagGroup.propTypes = {
  children: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired
}

TagGroup.defaultProps = {
}
