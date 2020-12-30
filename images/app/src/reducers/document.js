import { nextLine, prevLine } from '../actions/navigateDocument'
import { createSlice } from '@reduxjs/toolkit'
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
    }
  }
} );

export default documentSlice.reducer;
