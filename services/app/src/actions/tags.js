import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

export const addTag = createAction(
  'TAG_ADDED',
  ( path, value ) => ( {
    payload: {
      path,
      value
    }
  } )
)

export const assignTag = createAction(
  'TAG_ASSIGNED',
  value => ( {
    payload: {
      value
    }
  } )
)

export const fetchTags = createAsyncThunk(
  'TAG_FETCH',
  async () => {
    const response = await fetch(
      'http://localhost:8000/tags/'
    )

    if ( !response.ok ) {
      const message = `An error has occured: ${ response.status }`;
      throw new Error( message );
    }

    const data = await response.json()
    return data
  }
)

export const unassignTag = createAction(
  'TAG_UNASSIGNED',
  value => ( {
    payload: {
      value
    }
  } )
)
