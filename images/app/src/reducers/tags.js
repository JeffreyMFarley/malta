import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  groups: [
    { stack: [
      'infrastructure',
      { database: [ 'Relational', 'Warehouse' ]},
      'API',
      { UI: [ 'web', 'desktop', 'visualization' ]},
      { BI: [ 'Reports', 'KPI', 'Analytics', 'M/L', 'AI', 'map/reduce' ]},
      'ETL'
    ]},
    { tasks: [
      'start',
      'pmo',
      'plan',
      { design: [ 'ux', 'data modeling', 'architecture' ]},
      { dev: [ 'write code' ]},
      { ops: [ 'release', 'monitor', 'service desk', 'infra support' ]},
      'close'
    ]}
  ]
}

export const tagsSlice = createSlice( {
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: {}
} );

export default tagsSlice.reducer;
