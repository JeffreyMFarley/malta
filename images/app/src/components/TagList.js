import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import PropTypes from 'prop-types';
import React from 'react';

export default class TagList extends React.Component {

  render() {
    const { elementChooser, items, level } = this.props;
    return (
      <ButtonToolbar>
        { items.map( x => elementChooser( x, level ) ) }
      </ButtonToolbar>
    );
  }
}

// --------------------------------------------------------------------------
// Meta

TagList.propTypes = {
  elementChooser: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  level: PropTypes.number
}

TagList.defaultProps = {
  level: 0
}
