import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux';
import React from 'react';
import TagGroup from './TagGroup';
import TagList from './TagList';

const renderSwitch = ( x, level ) => {
  if ( Array.isArray( x ) ) {
    return <TagList items={x} elementChooser={renderSwitch} level={level} />
  }

  if ( typeof x === 'object' ) {
    return Object.keys( x ).map( k =>
        <TagGroup label={k} children={x[k]}
                  elementChooser={renderSwitch} level={level + 1} />
    )
  }

  return <Button class="tag-leaf" variant="outline-secondary">{x}</Button>
}

/**
* Creates the top-level component to manage tags
*
* @param {object} props the properties of the component
* @returns {string} the HTML to render
*/
function TagPanel( { tags } ) {
  return (
    <div class="tag-panel">
      { renderSwitch( tags.groups, 0 ) }
    </div>
  )
}

const mapStateToProps = state => ( { tags: state.tags } )

export default connect( mapStateToProps )( TagPanel );
