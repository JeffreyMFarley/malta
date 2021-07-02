import { configureStore } from '@reduxjs/toolkit';
import document from './reducers/document';
import { enableMapSet } from 'immer'
import tags from './reducers/tags';

enableMapSet()

export default configureStore( {
  reducer: {
    document,
    tags
  }
} );
