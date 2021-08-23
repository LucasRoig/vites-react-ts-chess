import React, {useContext} from "react";
import {ContextMenuContext, ContextMenuProvider} from "../shared-components/context-menu/ContextMenuContext";
import {Position} from "../libraries/chess";
import {TextEditorContext} from "../libraries/text-editor/TextEditorContext";
import {Menu} from "@headlessui/react";
import {GameController} from "../libraries/chess/GameController";
const MoveContextMenu = React.createContext<{
  handleContextMenu: (e: React.MouseEvent<HTMLElement, MouseEvent>, p: Position) => void,
}>({
  handleContextMenu: (e,p) => console.error("Not Implemented"),
})

export const MoveContextMenuProvider: React.FC<{
  deleteFromPosition: (p: Position) => void,
  promoteVariation: (p: Position) => void
}> = (props) => {

  const handleContextMenu = (ctx: React.ContextType<typeof ContextMenuContext>) => (e: React.MouseEvent<HTMLElement, MouseEvent>, p: Position) => {
    console.log("context menu opened on", p)
    ctx.handleContextMenu(e, <ContextMenu position={p} promoteVariation={props.promoteVariation}
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
  position: Position,
  deleteFromPosition: (p: Position) => void,
  promoteVariation: (p: Position) => void
}> = ({position, deleteFromPosition, promoteVariation}) => {
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
              {!GameController.isMainline(position) &&(
                <>
                  <Menu.Item>
                    <a className="dropdown-item">Delete variation</a>
                  </Menu.Item>
                  <Menu.Item>
                    <a className="dropdown-item" onClick={() => promoteVariation(position)}>Promote variation</a>
                  </Menu.Item>
                  <Menu.Item>
                    <a className="dropdown-item">Make main line</a>
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
