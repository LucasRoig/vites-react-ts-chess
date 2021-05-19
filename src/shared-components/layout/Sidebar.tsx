import React from "react";
import "./Sidebar.scss"
import {Link} from "react-router-dom";

interface SidebarProps {

}
const Sidebar: React.FunctionComponent<SidebarProps> = () => {
    return (
        <aside className="sidebar">
            <nav className="menu">
                <p className="menu-label">
                    General
                </p>
                <ul className="menu-list">
                    <li><Link to="/databases">Databases</Link></li>
                    <li><Link to="/notebooks">Notebooks</Link></li>
                </ul>
            </nav>
        </aside>
    )
}

export {
    Sidebar
}