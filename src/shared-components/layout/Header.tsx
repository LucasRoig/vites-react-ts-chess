import React, {useEffect} from "react";
import "./Header.scss"
import {useAuth0} from "@auth0/auth0-react";

interface HeaderProps {

}

const Header: React.FunctionComponent<HeaderProps> = () => {
    const {isAuthenticated} = useAuth0()
    return (
        <header className="header">
            <nav className="navbar">
                <div className="navbar-menu">
                    <div className="navbar-start">
                        <div className="navbar-item">
                            <button className="button is-light">New Game</button>
                        </div>
                    </div>
                    {isAuthenticated ? <RightSideAuthenticated/> : <RightSideNotAuthenticated/>}
                </div>
            </nav>
        </header>
    )
}

const RightSideAuthenticated: React.FunctionComponent = () => {
    const {logout, user} = useAuth0()
    return (
        <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">
                    { user?.picture &&
                        <figure className="user-icon">
                            <img src={user?.picture}/>
                        </figure>
                    }
                    {user?.name}
                </a>
                <div className="navbar-dropdown">
                    <a className="navbar-item" onClick={() => logout()}>
                        Logout
                    </a>
                </div>
            </div>
        </div>
    )
}

const RightSideNotAuthenticated: React.FunctionComponent = () => {
    const {loginWithRedirect} = useAuth0()
    return (
        <div className="navbar-end">
            <div className="navbar-item">
                <button className="button is-light" onClick={loginWithRedirect}>Login</button>
            </div>
        </div>
    )
}

export {
    Header
}
