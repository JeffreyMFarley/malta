import App from './App';
import { fetchTags } from './actions/tags'
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';

// ----------------------------------------------------------------------------
// Initial actions
store.dispatch( fetchTags() )

// ----------------------------------------------------------------------------
// Initial Render

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById( 'root' )
);
