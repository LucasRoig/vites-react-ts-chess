import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import {Auth0Provider} from "@auth0/auth0-react";
import {Router, BrowserRouter, HashRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./store";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import {Auth0ProviderWithHistory} from "./shared-components/Auth0ProviderWithHistory";
import ConfirmationModalContextProvider from "./shared-components/confirmation-modal/ConfirmationModalContext";

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
        <Auth0Provider domain="dev-5t4zeimz.eu.auth0.com" clientId="2NDmidAn4IWQgsLYqXVy3R8LcMFyPIDk"
                       redirectUri={window.location.origin} audience="http://nest-chess-api.athomeprod.fr">
          {/*<Auth0ProviderWithHistory>*/}
          <HashRouter>
            <ConfirmationModalContextProvider>
              <App/>
              <ToastContainer/>
            </ConfirmationModalContextProvider>
          </HashRouter>
          {/*</Auth0ProviderWithHistory>*/}
        </Auth0Provider>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
