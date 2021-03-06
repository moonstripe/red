import React from 'react';
import ReactDOM from 'react-dom';

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';

import rootReducer from './redux';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const logger = createLogger({
  predicate: (getState, action) => (
    (action.type !== '@@redux-form/CHANGE') &&
    (action.type !== '@@redux-form/BLUR') &&
    (action.type !== '@@redux-form/FOCUS') &&
    (action.type !== '@@redux-form/UPDATE_SYNC_ERRORS') &&
    (action.type !== '@@redux-form/TOUCH')
  ),
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [logger],
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
