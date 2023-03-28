import React from 'react';
import { RouterProvider } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import reportWebVitals from './reportWebVitals';
import './index.scss';
import Router from './Router';

import CssBaseline from '@mui/material/CssBaseline';

const container = document.getElementById('root')!;
const root = createRoot(container);


root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={Router} />
      <CssBaseline />
    </Provider>
  </React.StrictMode>
);

// reportWebVitals(console.log);
