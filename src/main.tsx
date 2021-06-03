import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import {Auth0Provider} from "@auth0/auth0-react";
import {HashRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider domain="dev-5t4zeimz.eu.auth0.com" clientId="2NDmidAn4IWQgsLYqXVy3R8LcMFyPIDk" redirectUri={window.location.origin} audience="chess-faste">
          <HashRouter>
            <App />
          </HashRouter>
      </Auth0Provider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
