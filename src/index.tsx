// import React from 'react';
// import * as ReactDOMClient from 'react-dom/client';
// import App from './components/app/app';

// import { BrowserRouter } from 'react-router-dom'; // Импорт маршрутизатора
// import { Provider } from 'react-redux'; // Импорт провайдера Redux

// import store from './services/store';

// const container = document.getElementById('root') as HTMLElement;
// const root = ReactDOMClient.createRoot(container!);

// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       {' '}
//       {/* Обернули в Provider, чтобы использовать Redux */}
//       <BrowserRouter>
//         {' '}
//         {/* Обернули в BrowserRouter для маршрутизации */}
//         <App />
//       </BrowserRouter>
//     </Provider>
//   </React.StrictMode>
// );

import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './services/store';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
