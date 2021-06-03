import {Tab} from "./TabsReducer";

export const CLICK_TAB_ACTION = "CLICK_TAB_ACTION"
export const OPEN_TAB_ACTION = "OPEN_TAB_ACTION"
const CLOSE_TAB_ACTION = "CLOSE_TAB_ACTION"

interface ClickTabActionType {
  type: typeof CLICK_TAB_ACTION
  payload: Tab
}

export function ClickTabAction(tab: Tab): ClickTabActionType {
  return {
    type: CLICK_TAB_ACTION,
    payload: tab
  }
}

interface OpenTabActionType {
  type: typeof OPEN_TAB_ACTION
  payload: Tab
}

export function OpenTabAction(tab: Tab): OpenTabActionType {
  return {
    type: OPEN_TAB_ACTION,
    payload: tab
  }
}

interface CloseTabActionType {
  type: typeof CLOSE_TAB_ACTION
  payload: Tab
}

export function CloseTabAction(tab: Tab): CloseTabActionType {
  return {
    type: CLOSE_TAB_ACTION,
    payload: tab
  }
}

export type TabActionType = ClickTabActionType | OpenTabActionType | CloseTabActionType
