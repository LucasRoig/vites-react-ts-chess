import {Tab} from "./TabsReducer";
import TabsService from "../../@core/TabsService";
import TempGamesService from "../../@core/TempGamesService"
import {DocumentService} from "../../libraries/text-editor/DocumentService";

const CLICK_TAB_ACTION = "CLICK_TAB_ACTION"
const OPEN_TAB_ACTION = "OPEN_TAB_ACTION"
const CLOSE_TAB_ACTION = "CLOSE_TAB_ACTION"
const LOAD_TABS_ACTION = "LOAD_TABS_ACTION"
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

export function OpenTabAction({name, path}: {name: string, path: string}): OpenTabActionType {
  const tab = TabsService.openTab({name, path})
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
  let match = tab.path.match(/\/tempGames\/(\d+)/)
  if (match) {
    const id = parseInt(match[1])
    TempGamesService.closeGame(id)
  }

  match = tab.path.match(/\/databases\/(\w+)\/games\/(\w+)/)

  if (match) {
    const dbId = match[1]
    const gameId = match[2]
    TempGamesService.closeGameFromDb(gameId, dbId)
  }

  match = tab.path.match(/\/documents\/(.+)/)
  if (match) {
    const id = match[1]
    DocumentService.closeTempDocument(id)
  }
  TabsService.closeTab(tab)
  return {
    type: CLOSE_TAB_ACTION,
    payload: tab
  }
}

interface LoadTabsActionType {
  type: typeof LOAD_TABS_ACTION
  payload: Tab[]
}

// Example of async action
// export const LoadTabsAction =  (): ThunkAction<void, {}, unknown, TabActionType> => async (dispatch) => {
//   const response = await TabsService.fetchTabs()
//   dispatch({
//     type: LOAD_TABS_ACTION,
//     payload: response
//   })

export const LoadTabsAction =  (): LoadTabsActionType => {
  const response = TabsService.fetchTabs()
  return {
    type: LOAD_TABS_ACTION,
    payload: response
  }
}

export const OpenNewTempGameAction = (): TabActionType => {
  const temporaryGame = TempGamesService.newTemporaryGame();
  return OpenTabAction({
    name: "New Game",
    path: "/tempGames/" + temporaryGame.temporaryId
  })
}

export const OpenNewDocumentAction = (): TabActionType => {
  const doc = DocumentService.createTempDocument();
  return OpenTabAction({
    name: "New Document",
    path: "/documents/" + doc.tempId
  })
}

export const OpenGameFromDbAction = (gameId: string, dbId: string, white:string, black: string): TabActionType => {
  return OpenTabAction({
    name: `${white}${black ? " - " + black : ""}`,
    path: `/databases/${dbId}/games/${gameId}`
  })
}

export const OpenDocumentFromDbAction = (docTitle: string, dbId: string, docId: string): TabActionType => {
  return OpenTabAction({
    name: docTitle,
    path: `/databases/${dbId}/documents/${docId}`
  })
}

export type TabActionType = ClickTabActionType | OpenTabActionType | CloseTabActionType | LoadTabsActionType
