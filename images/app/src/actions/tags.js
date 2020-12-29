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
