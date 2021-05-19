import React from "react";
import {Route} from "react-router-dom";
import {withAuthenticationRequired} from "@auth0/auth0-react";
import {OmitNative, RouteProps} from "react-router";
interface ProtectedRouteProperties {
    component:  React.ComponentType<any>
    path: string
    exact: boolean
}

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProperties> = ({component, ...args}) => (
    <Route
        component={withAuthenticationRequired(component)}
        {...args}
    />
)

export {
    ProtectedRoute
}