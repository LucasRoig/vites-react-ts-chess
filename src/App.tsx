import React, {useState} from 'react'
import logo from './logo.svg'
import './App.scss'
import Button from "@storybook/react/dist/demo/Button";
import {Header} from "./shared-components/layout/Header";
import {Sidebar} from "./shared-components/layout/Sidebar";
import {Switch, Route} from "react-router-dom";
import {ProtectedRoute} from "./shared-components/ProtectedRoute";
import {Databases} from "./databases/Databases";
import {Notebooks} from "./notebooks/Notebooks";

function App() {

    return (
        <>
            <Header/>
            <div className="is-flex">
                <Sidebar/>
                <div>
                    <Switch>
                        <Route path="/" exact>
                            <div>Home</div>
                        </Route>
                        <ProtectedRoute path="/databases" exact component={Databases}>
                        </ProtectedRoute>
                        <ProtectedRoute path="/notebooks" exact component={Notebooks}>
                        </ProtectedRoute>
                    </Switch>
                </div>
            </div>
        </>
    )
}

export default App
