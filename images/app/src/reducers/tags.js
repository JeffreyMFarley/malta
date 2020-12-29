import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  dimensions: [
    { Stack: [
      { infrastructure: [ 'Windows', 'Linux', 'IaaS', 'Cloud' ]},
      { database: [ 'Relational', 'Warehouse' ]},
      { API: []},
      { UI: [ 'Browser', 'Desktop', 'Visualization', 'Charts' ]},
      { BI: [ 'Reports', 'KPI', 'Analytics', 'M/L', 'AI', 'Map/Reduce' ]},
      { ETL: []}
    ]},
    { Tasks: [
      { start: []},
      { PMO: [ 'track budget', 'manage resources', 'agile' ]},
      { plan: [ 'gather requirements' ]},
      { design: [ 'ux', 'data modeling', 'architecture' ]},
      { dev: [ 'code', 'test' ]},
      { ops: [ 'release', 'monitor', 'service desk', 'infra support' ]},
      { close: []}
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
