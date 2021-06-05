import {Tab} from "../store/tabs/TabsReducer";
import ApiService from "./ApiService";

function getLocalStorageTabs(): Tab[]{
  const tabsStr = localStorage.getItem("tabs");
  return  tabsStr ? JSON.parse(tabsStr) as Tab[] : []
}

function addToLocalStorage({name, path}: {name: string, path: string}) {
  const tabs = getLocalStorageTabs();
  const found = tabs.find(t => t.path === path)
  if (found) {
    return found
  }
  let id = Math.max(...tabs.map(t => t.id), -1) + 1
  const tab = {
    name,
    path,
    id: id
  }
  tabs.push(tab)
  localStorage.setItem("tabs", JSON.stringify(tabs))
  return tab
}

function removeFromLocalStorage(t: Tab) {
  const tabs = getLocalStorageTabs().filter(tab => tab.id !== t.id);
  localStorage.setItem("tabs", JSON.stringify(tabs))
}

function fetchTabs(): Tab[] {
  return getLocalStorageTabs()
}

function openTab({name, path}: {name: string, path: string}): Tab {
  const tab = addToLocalStorage({name, path})
  return tab
}

function closeTab(tab: Tab): void {
  removeFromLocalStorage(tab)
}

export default {
  fetchTabs,
  openTab,
  closeTab
}
