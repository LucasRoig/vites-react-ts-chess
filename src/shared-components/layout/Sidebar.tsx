import React from "react";
import "./Sidebar.scss"
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
                    <li><a>Databases</a></li>
                    <li><a>Notebooks</a></li>
                </ul>
            </nav>
        </aside>
    )
}

export {
    Sidebar
}