/* eslint-disable no-console, no-alert */

import {
  activeLineSelector, assignedTagsSelector
} from '../selectors/document'
import { addTag } from '../actions/tags'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form'
// import PropTypes from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row'

class TagGroup extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { newTag: '' };
    this.handleInput = this.handleInput.bind( this );
    this.handleSubmit = this.handleSubmit.bind( this );
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
    this.setState( { newTag: '' } );
  }

  render() {
    const { activeLine, assigned, children, label, tokenized } = this.props

    const selVariant = ( x, defaultValue ) => {
      const lx = x.toLowerCase();
      const wx = ' ' + lx;

      let variant = defaultValue
      if ( assigned.has( x ) ) {
        variant = 'primary'
      } else if ( tokenized.has( lx ) ) {
        variant = 'warning'
      } else if ( activeLine.includes( wx ) ) {
        variant = 'warning'
      }

      return variant
    }

    return (
      <Row noGutters className="pb-2">
        <Button variant={ selVariant( label, 'secondary' ) }
                size="sm">
          {label}
        </Button>
        { children.map(
          x => <Button variant={ selVariant( x, 'outline-secondary' ) }
                       size="sm"
                       key={x}>
                  {x}
               </Button>
        ) }
        <Form inline onSubmit={this.handleSubmit}>
          <Button size="sm"
                  variant="light"
                  type="submit">+</Button>
          <Form.Label htmlFor={label + '_new'} srOnly>
            Tag
          </Form.Label>
          <Form.Control id={label + '_new'}
                        className="px-0 py-0"
                        onChange={this.handleInput}
                        value={this.state.newTag}
                        />
        </Form>

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
