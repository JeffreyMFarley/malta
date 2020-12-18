import { configureStore } from '@reduxjs/toolkit';
import tags from './reducers/tags';

export default configureStore( {
  reducer: {
    tags
  }
} );
