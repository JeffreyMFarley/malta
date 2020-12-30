import { createAction } from '@reduxjs/toolkit';

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

export const unassignTag = createAction(
  'TAG_UNASSIGNED',
  value => ( {
    payload: {
      value
    }
  } )
)
