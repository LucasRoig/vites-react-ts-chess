import React from "react";
import "./Header.scss"
interface HeaderProps {

}
const Header: React.FunctionComponent<HeaderProps> = () => {
    return (
        <header className="header">
            <nav className="navbar">
                <div className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <button className="button is-light">Login</button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export {
    Header
}