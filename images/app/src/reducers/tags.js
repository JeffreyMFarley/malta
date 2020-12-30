import { createSlice, current } from '@reduxjs/toolkit';
import { addTag } from '../actions/tags'
import { cloneDeep } from '../utils'
import fixtureTags from './__fixtures__/tags-initial'

export const initialState = cloneDeep( fixtureTags )

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
    }
  }
} );

export default tagsSlice.reducer;
