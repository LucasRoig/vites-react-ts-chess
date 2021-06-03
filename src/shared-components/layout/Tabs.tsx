import React from "react";
import {useAppDispatch, useAppSelector} from "../../store";
import {Tab} from "../../store/tabs/TabsReducer";
import {ClickTabAction, CloseTabAction} from "../../store/tabs/actions";

const Tabs : React.FunctionComponent = () => {
  let state = useAppSelector(state => state.tabs)
  let dispatch = useAppDispatch()
  const clickTab = (tab: Tab) => () => {
    dispatch(ClickTabAction(tab))
  }
  const closeTab = (tab: Tab) => (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(CloseTabAction(tab))
  }
  return (
    <div className="tabs" style={{backgroundColor: 'white'}}>
      <ul>
        {state.openedTabs.map(t =>
          <li key={t.path} className={state.selectedTab?.path === t.path ? "is-active" : ""}>
            <a onClick={clickTab(t)}>
              <span>{t.name}</span>
              <button className="button is-small" style={{marginLeft: '.5rem'}} onClick={closeTab(t)}>
                <span className="icon is-small">
                  <i className="fas fa-times"/>
                </span>
              </button>
            </a>
          </li>
        )}
      </ul>
    </div>
  )
}

export {
  Tabs
}
