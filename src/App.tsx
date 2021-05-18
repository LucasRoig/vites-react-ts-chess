import React, {useState} from 'react'
import logo from './logo.svg'
import './App.css'
import Button from "@storybook/react/dist/demo/Button";
import {Header} from "./shared-components/layout/Header";
import {Sidebar} from "./shared-components/layout/Sidebar";

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Header/>
            <div>
                <Sidebar/>
            </div>
        </>
    )
}

export default App
