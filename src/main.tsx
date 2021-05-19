import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import {Auth0Provider} from "@auth0/auth0-react";
import {HashRouter} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
      <Auth0Provider domain="dev-5t4zeimz.eu.auth0.com" clientId="2NDmidAn4IWQgsLYqXVy3R8LcMFyPIDk" redirectUri={window.location.origin}>
          <HashRouter>
            <App />
          </HashRouter>
      </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
