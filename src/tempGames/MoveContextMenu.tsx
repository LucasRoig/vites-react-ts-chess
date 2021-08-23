import React, {useContext} from "react";
import {ContextMenuContext, ContextMenuProvider} from "../shared-components/context-menu/ContextMenuContext";
import {Menu} from "@headlessui/react";
import {NormalizedGame, NormalizedGameHelper, NormalizedPosition} from "../libraries/chess/NormalizedGame";
const MoveContextMenu = React.createContext<{
  handleContextMenu: (e: React.MouseEvent<HTMLElement, MouseEvent>, p: NormalizedPosition) => void,
}>({
  handleContextMenu: () => console.error("Not Implemented"),
})

export const MoveContextMenuProvider: React.FC<{
  deleteFromPosition: (p: NormalizedPosition) => void,
  promoteVariation: (p: NormalizedPosition) => void,
  makeMainLine: (p: NormalizedPosition) => void,
  deleteVariation: (p: NormalizedPosition) => void,
  game: NormalizedGame
}> = (props) => {

  const handleContextMenu = (ctx: React.ContextType<typeof ContextMenuContext>) => (e: React.MouseEvent<HTMLElement, MouseEvent>, p: NormalizedPosition) => {
    console.log("context menu opened on", p)
    ctx.handleContextMenu(e, <ContextMenu position={p} promoteVariation={props.promoteVariation}
                                          deleteVariation={props.deleteVariation} game={props.game}
                                          makeMainLine={props.makeMainLine}
                                          deleteFromPosition={props.deleteFromPosition}/>)
  }

  return (
    <ContextMenuProvider>
      <ContextMenuContext.Consumer>
        {ctx => (
          <MoveContextMenu.Provider value={{handleContextMenu: handleContextMenu(ctx)}}>
            {props.children}
          </MoveContextMenu.Provider>
        )}
      </ContextMenuContext.Consumer>

    </ContextMenuProvider>
  )
}

const ContextMenu: React.FC<{
  position: NormalizedPosition,
  game: NormalizedGame
  deleteFromPosition: (p: NormalizedPosition) => void,
  promoteVariation: (p: NormalizedPosition) => void
  makeMainLine: (p: NormalizedPosition) => void
  deleteVariation: (p: NormalizedPosition) => void
}> = ({game, position, deleteFromPosition, promoteVariation, makeMainLine, deleteVariation}) => {
  return(
    <Menu>
      <div className={"dropdown is-active"} style={{marginRight: "1rem"}}>
        <Menu.Items static>
          <div className={"dropdown-menu"}>
            <div className={"dropdown-content"}>
              <p className="dropdown-item"><b>{position.san}</b></p>
              <Menu.Item>
                <a className="dropdown-item" onClick={() => deleteFromPosition(position)}>Delete from here</a>
              </Menu.Item>
              {!NormalizedGameHelper.isMainline(game, position) &&(
                <>
                  <Menu.Item>
                    <a className="dropdown-item" onClick={() => deleteVariation(position)}>Delete variation</a>
                  </Menu.Item>
                  <Menu.Item>
                    <a className="dropdown-item" onClick={() => promoteVariation(position)}>Promote variation</a>
                  </Menu.Item>
                  <Menu.Item>
                    <a className="dropdown-item" onClick={() => makeMainLine(position)}>Make main line</a>
                  </Menu.Item>
                </>
                )
              }
            </div>
          </div>
        </Menu.Items>
      </div>
    </Menu>
  )
}

export const useMoveContextMenu = () => useContext(MoveContextMenu)
