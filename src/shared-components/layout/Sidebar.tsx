import React from "react";
import "./Sidebar.scss"
import {Link} from "react-router-dom";
import {useAppDispatch} from "../../store";
import {Tab} from "../../store/tabs/TabsReducer";
import {OpenTabAction} from "../../store/tabs/actions";

interface SidebarProps {

}
const Sidebar: React.FunctionComponent<SidebarProps> = () => {
    const dispatch = useAppDispatch();
    const openTab = (tab: Tab) => () => {
        dispatch(OpenTabAction(tab))
    }
    return (
        <aside className="sidebar">
            <nav className="menu">
                <p className="menu-label">
                    General
                </p>
                <ul className="menu-list">
                    <li><a onClick={openTab({name: "databases", path:"/databases"})}>Databases</a></li>
                    <li><a onClick={openTab({name: "notebooks", path:"/notebooks"})}>Notebooks</a></li>
                </ul>
            </nav>
        </aside>
    )
}

export {
    Sidebar
}
