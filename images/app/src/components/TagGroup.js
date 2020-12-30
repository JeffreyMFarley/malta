/* eslint-disable no-console, no-alert */

import {
  activeLineSelector, assignedTagsSelector
} from '../selectors/document'
import { addTag, assignTag, unassignTag } from '../actions/tags'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form'
// import PropTypes from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row'

class TagGroup extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { newTag: '', showEdit: false };
    this.handleInput = this.handleInput.bind( this );
    this.handleSubmit = this.handleSubmit.bind( this );
    this.handleToggle = this.handleToggle.bind( this );
  }

  handleInput = ev => {
    this.setState( {
      newTag: ev.target.value
    } );
  }

  handleSubmit = ev => {
    const { dispatch, path } = this.props

    ev.preventDefault()
    dispatch( addTag( path, this.state.newTag ) )
    this.setState( { newTag: '', showEdit: false } );
  }

  handleToggle = () => {
    this.setState( {
      showEdit: !this.state.showEdit
    } );
  }

  render() {
    const {
      activeLine, assigned, children, dispatch, label, tokenized
    } = this.props
    const { showEdit } = this.state

    const buildButton = ( x, defaultValue ) => {
      const lx = x.toLowerCase();
      const wx = ' ' + lx;

      let variant = defaultValue
      let clickAction = assignTag
      if ( assigned.has( x ) ) {
        variant = 'primary'
        clickAction = unassignTag
      } else if ( tokenized.has( lx ) ) {
        variant = 'warning'
      } else if ( activeLine.includes( wx ) ) {
        variant = 'warning'
      }

      return <Button variant={ variant }
                     size="sm"
                     key={x}
                     onClick={ () => dispatch( clickAction( x ) ) }>
              {x}
            </Button>
    }

    return (
      <Row noGutters className="pb-2">
        { buildButton( label, 'secondary' ) }
        { children.map( x => buildButton( x, 'outline-secondary' ) ) }
        <Button variant="light"
               size="sm"
               onClick={this.handleToggle}>
         { showEdit ? '-' : '+' }
        </Button>
        { showEdit && <Form inline onSubmit={this.handleSubmit}>
          <Form.Label htmlFor={label + '_new'} srOnly>
            Tag
          </Form.Label>
          <Form.Control id={label + '_new'}
                        className="px-0 py-0"
                        onChange={this.handleInput}
                        value={this.state.newTag}
                        />
          <Button variant="success"
                  type="submit">Add</Button>
        </Form> }

      </Row>
    );
  }
}

// --------------------------------------------------------------------------
// redux

const mapStateToProps = state => {
  const activeLine = activeLineSelector( state ).toLowerCase()

  return {
    activeLine,
    assigned: assignedTagsSelector( state ),
    tokenized: new Set( activeLine.split( ' ' ) )
  }
}

export default connect( mapStateToProps )( TagGroup );
