import React, {useEffect} from 'react'
import './App.scss'
import {Header} from "./shared-components/layout/Header";
import {Sidebar} from "./shared-components/layout/Sidebar";
import {Switch, Route} from "react-router-dom";
import {ProtectedRoute} from "./shared-components/ProtectedRoute";
import {Databases} from "./databases/Databases";
import {Notebooks} from "./notebooks/Notebooks";
import {Tabs} from "./shared-components/layout/Tabs";
import {useAppDispatch, useAppSelector} from "./store";
import {useHistory} from "react-router-dom"
import {LoadTabsAction} from "./store/tabs/actions";
import {useAuth0} from "@auth0/auth0-react";
import ApiService from "./@core/ApiService";
import TempGameView from "./tempGames/TempGameView";
import {DatabaseDetails} from "./databases/DatabaseDetails";
import {TabRouterHandler} from "./TabRouterHandler";

function App() {
    const dispatch = useAppDispatch()
    const {isAuthenticated, getAccessTokenSilently} = useAuth0()
    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently().then(t => {
                console.log("set token", t)
                ApiService.setAuthToken(t)
                dispatch(LoadTabsAction())
            })
        } else {
            console.log("remove token")
            ApiService.setAuthToken("")
        }
    }, [isAuthenticated])

    return (
        <>
            <TabRouterHandler/>
            <Header/>
            <div className="is-flex">
                <Sidebar/>
                <div style={{width: '100%'}}>
                    <Tabs/>
                    <Switch>
                        <Route path="/" exact>
                            <div>Select a Tab</div>
                        </Route>
                        <ProtectedRoute path="/databases" exact component={Databases}/>
                        <ProtectedRoute path="/databases/:id" exact component={DatabaseDetails}/>
                        <ProtectedRoute path="/databases/:dbId/games/:id" exact component={TempGameView}/>
                        <ProtectedRoute path="/notebooks" exact component={Notebooks}/>
                        <ProtectedRoute path="/tempGames/:id" exact component={TempGameView}/>
                    </Switch>
                </div>
            </div>
        </>
    )
}

export default App
