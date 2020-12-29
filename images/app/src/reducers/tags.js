import { createSlice, current } from '@reduxjs/toolkit';
import { addTag } from '../actions/tags'

export const initialState = {
  dimensions: [
    { Stack: [
      { UI: [ 'Browser', 'Desktop', 'Visualization', 'Charts' ]},
      { BI: [ 'Reports', 'KPI', 'Analytics', 'M/L', 'AI', 'Map/Reduce' ]},
      { API: []},
      { Database: [ 'Relational', 'Warehouse' ]},
      { ETL: []},
      { Integration: [ 'CI/CD' ]},
      { Infrastructure: [ 'Windows', 'Linux', 'IaaS', 'Cloud' ]}
    ]},
    { Tasks: [
      { start: []},
      { PMO: [
        'track budget', 'manage resources', 'agile', 'change management'
      ]},
      { plan: [ 'analysis', 'requirements', 'user stories' ]},
      { design: [ 'ux', 'data modeling', 'architecture', 'solution' ]},
      { develop: [ 'code', 'test' ]},
      { operate: [
        'configure', 'release', 'monitor', 'service desk',
        'disaster recovery'
      ]},
      { close: []}
    ]}
  ]
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
    }
  }
} );

export default tagsSlice.reducer;
