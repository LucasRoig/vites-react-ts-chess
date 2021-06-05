import {TabActionType} from "./actions";

export interface Tab {
  name: string
  path: string
  id: number
}

interface TabsState {
  openedTabs: Tab[]
  selectedTab?: Tab
}

const defaultState: TabsState = {
  openedTabs: [],
  selectedTab: undefined
}

const tabReducer = (state = defaultState, action: TabActionType): TabsState => {
  switch (action.type) {
    case "CLICK_TAB_ACTION":
      return {
        ...state,
        selectedTab: action.payload
      }
    case "OPEN_TAB_ACTION":
      let tab = state.openedTabs.find(t => t.path === action.payload.path)
      if (!tab) {
        return {
          ...state,
          openedTabs: [...state.openedTabs, action.payload],
          selectedTab: action.payload
        }
      } else {
        return {
          ...state,
          selectedTab: tab
        }
      }
    case "LOAD_TABS_ACTION":
      return {
        ...state,
        openedTabs: action.payload,
        selectedTab: action.payload[0]
      }
    case "CLOSE_TAB_ACTION":
      const index = state.openedTabs.findIndex(t => t === action.payload)
      if (index < 0) {
        return state
      }
      const newTabs = [
        ...state.openedTabs.slice(0, index),
        ...state.openedTabs.slice(index + 1)
      ]
      if (state.selectedTab === action.payload) {
        let selectedTab: Tab | undefined
        if (newTabs.length === 0) {
          selectedTab = undefined
        } else if (newTabs[index]) {
          selectedTab = newTabs[index]
        } else {
          selectedTab = newTabs[newTabs.length - 1]
        }
        return {
          ...state,
          openedTabs: newTabs,
          selectedTab: selectedTab
        }
      } else {
        return {
          ...state,
          openedTabs: newTabs
        }
      }

    default:
      return state
  }
}

export {
  tabReducer
}
