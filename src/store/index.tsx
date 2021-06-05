import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {tabReducer} from "./tabs/TabsReducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import thunk from "redux-thunk";
const rootReducer = combineReducers({
  tabs: tabReducer
})

const getMiddleware = () => {
  return applyMiddleware(thunk)
}

export const store = createStore(rootReducer, composeWithDevTools(getMiddleware()))

export type DispatchType = typeof store.dispatch
export type RootState = ReturnType<typeof rootReducer>

export const useAppDispatch = () => useDispatch<DispatchType>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
