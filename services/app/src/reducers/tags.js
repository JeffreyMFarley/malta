import { addTag, fetchTags } from '../actions/tags'
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  dimensions: [ { Stack: []}, { Tasks: []} ]
}

export const tagsSlice = createSlice( {
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: {
    [addTag]: ( state, action ) => {
      const { path, value } = action.payload;
      const [ a, b, c, d ] = path

      state.dimensions[a][b][c][d].push( value )
      return state
    },
    [fetchTags.fulfilled]: ( state, action ) => action.payload
  }
} );

export default tagsSlice.reducer;
