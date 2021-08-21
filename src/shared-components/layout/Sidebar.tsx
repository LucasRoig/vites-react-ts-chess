import React from "react";
import "./Sidebar.scss"
import {useAppDispatch} from "../../store";
import {OpenTabAction} from "../../store/tabs/actions";

interface SidebarProps {

}
const Sidebar: React.FunctionComponent<SidebarProps> = () => {
    const dispatch = useAppDispatch();
    const openTab = ({name, path}: {name: string, path: string}) => () => {
        dispatch(OpenTabAction({name, path}))
    }
    return (
        <aside className="sidebar layout__nav">
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
