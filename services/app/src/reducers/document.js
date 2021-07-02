import { assignTag, unassignTag } from '../actions/tags'
import { createSlice, current } from '@reduxjs/toolkit'
import { nextLine, prevLine } from '../actions/navigateDocument'
import fixtureTaskAreas from './__fixtures__/doc-task-areas'

export const initialState = {
  current: 2,
  lines: fixtureTaskAreas.lines,
  tagged: fixtureTaskAreas.tagged
}

export const documentSlice = createSlice( {
  name: 'document',
  initialState,
  reducers: {},
  extraReducers: {
    [assignTag]: ( state, action ) => {
      const { value } = action.payload
      const assigned = current( state ).tagged[state.current]
      if ( typeof assigned === 'undefined' ) {
        state.tagged[state.current] = new Set( [ value ] )
      } else {
        state.tagged[state.current].add( value )
      }
    },
    [nextLine]: state => {
      state.current += 1;
      if ( state.current >= state.lines.length ) {
        state.current = state.lines.length - 1;
      }
      return state
    },
    [prevLine]: state => {
      state.current -= 1;
      if ( state.current < 0 ) {
        state.current = 0
      }
      return state
    },
    [unassignTag]: ( state, action ) => {
      const { value } = action.payload
      const assigned = current( state ).tagged[state.current]
      if ( typeof assigned !== 'undefined' ) {
        state.tagged[state.current].delete( value )
      }
    }
  }
} );

export default documentSlice.reducer;
