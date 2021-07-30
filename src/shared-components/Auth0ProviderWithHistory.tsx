import React from "react";
import {useHistory} from "react-router-dom";
import {AppState, Auth0Provider} from "@auth0/auth0-react";

const Auth0ProviderWithHistory: React.FunctionComponent = ({children}) => {
  const domain = "dev-5t4zeimz.eu.auth0.com";
  const clientId = "2NDmidAn4IWQgsLYqXVy3R8LcMFyPIDk";
  const audience = "http://nest-chess-api.athomeprod.fr"
  const history = useHistory();
  const onRedirectCallback = (state: AppState) => {
    history.push(state?.returnTo || window.location.pathname)
  }

  return (
    <Auth0Provider domain={domain} clientId={clientId} redirectUri={window.location.origin} audience={audience} onRedirectCallback={onRedirectCallback}>
      {children}
    </Auth0Provider>
  )
}

export {
  Auth0ProviderWithHistory
}
