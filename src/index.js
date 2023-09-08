import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import App from './App';

const theme = createTheme();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
