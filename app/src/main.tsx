import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';
import './app/layout/index.css';
import { router } from './app/router/Route';
import { StoreContext, store } from './app/store/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StoreContext.Provider value={store}>
    <RouterProvider router={router} />
  </StoreContext.Provider>
);

function filterConsoleMessages(originalMethod: (...args: any[]) => void) {
  return function (message: any, ...args: any[]) {
    if (typeof message === 'string') {
      return;
    }

    originalMethod.call(console, message, ...args);
  };
}

console.warn = filterConsoleMessages(console.warn);
console.error = filterConsoleMessages(console.error);