import { configureStore } from '@reduxjs/toolkit';
import document from './reducers/document';
import tags from './reducers/tags';

export default configureStore( {
  reducer: {
    document,
    tags
  }
} );
