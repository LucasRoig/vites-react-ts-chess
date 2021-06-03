import React, {useEffect, useState} from 'react'
import logo from './logo.svg'
import './App.scss'
import Button from "@storybook/react/dist/demo/Button";
import {Header} from "./shared-components/layout/Header";
import {Sidebar} from "./shared-components/layout/Sidebar";
import {Switch, Route} from "react-router-dom";
import {ProtectedRoute} from "./shared-components/ProtectedRoute";
import {Databases} from "./databases/Databases";
import {Notebooks} from "./notebooks/Notebooks";
import {Tabs} from "./shared-components/layout/Tabs";
import {useAppSelector} from "./store";
import {useHistory} from "react-router-dom"

function App() {
    let selectedTab = useAppSelector(s => s.tabs.selectedTab)
    const router = useHistory()
    useEffect(() => {
        if (selectedTab && selectedTab.path != router.location.hash) {
            router.push(selectedTab.path)
        }
        if (!selectedTab) {
            router.push("/")
        }
    }, [selectedTab])

    return (
        <>
            <Header/>
            <div className="is-flex">
                <Sidebar/>
                <div style={{width: '100%'}}>
                    <Tabs/>
                    <Switch>
                        <Route path="/" exact>
                            <div>Select a Tab</div>
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
