import React, {useEffect} from "react";
import {useAppSelector} from "./store";
import {useHistory} from "react-router-dom";

/**
 * We need to handle tab and router relation in a separate component. Handling it in App component triggers rerendering
 * of the whole app when a tab change, but before changing the route, which in then causes other bugs.
 * @constructor
 */
const TabRouterHandler: React.FC = () => {
  const selectedTab = useAppSelector(s => s.tabs.selectedTab)
  const router = useHistory()
  useEffect(() => {
    if (selectedTab && selectedTab.path != router.location.pathname) {
      router.push(selectedTab.path)
    }
    if (!selectedTab) {
      router.push("/")
    }
  }, [selectedTab])
  return null
}

export {
  TabRouterHandler
}
