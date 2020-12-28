import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import PropTypes from 'prop-types';
import React from 'react';

const LEVEL_COLORS = [ 'danger', 'primary', 'info' ]

export default class TagGroup extends React.Component {

  render() {
    const { children, elementChooser, label, level } = this.props;

    return (
      <ButtonGroup class="tag-group">
        <Button variant={ LEVEL_COLORS[level] }>{label}</Button>
        { elementChooser( children, level ) }
      </ButtonGroup>
    );
  }
}

// --------------------------------------------------------------------------
// Meta

TagGroup.propTypes = {
  children: PropTypes.object,
  elementChooser: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  level: PropTypes.number
}

TagGroup.defaultProps = {
  children: [],
  level: 0
}
