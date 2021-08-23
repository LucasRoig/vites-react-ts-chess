import React, {useContext} from "react";
import {ContextMenuContext, ContextMenuProvider} from "../shared-components/context-menu/ContextMenuContext";
import {Menu} from "@headlessui/react";
import {NormalizedGame, NormalizedGameHelper, NormalizedPosition} from "../libraries/chess/NormalizedGame";
import {useConfirmationModalContext} from "../shared-components/confirmation-modal/ConfirmationModalContext";
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
  setCommentAfter: (p: NormalizedPosition, comment: string) => void,
  setCommentBefore: (p: NormalizedPosition, comment: string) => void

  game: NormalizedGame
}> = (props) => {

  const handleContextMenu = (ctx: React.ContextType<typeof ContextMenuContext>) => (e: React.MouseEvent<HTMLElement, MouseEvent>, p: NormalizedPosition) => {
    console.log("context menu opened on", p)
    ctx.handleContextMenu(e, <ContextMenu position={p} promoteVariation={props.promoteVariation}
                                          deleteVariation={props.deleteVariation} game={props.game}
                                          makeMainLine={props.makeMainLine} setCommentAfter={props.setCommentAfter}
                                          setCommentBefore={props.setCommentBefore}
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
  setCommentAfter: (p: NormalizedPosition, comment: string) => void
  setCommentBefore: (p: NormalizedPosition, comment: string) => void
}> = ({game, position, deleteFromPosition, promoteVariation, makeMainLine, deleteVariation, setCommentAfter, setCommentBefore}) => {
  const ctx = useConfirmationModalContext();
  const commentAfter = async (p: NormalizedPosition) => {
    let text = p.comment || ""
    let body = (
      <textarea onChange={(e) => text = e.target.value} defaultValue={text}/>
    )
    const r = await ctx.showConfirmation({body: body, title: "Comment after move", validateText: "Save", cancelText: "Cancel"})
    if (r) {
      console.log("new comment", text)
      setCommentAfter(p, text)
    }
  }
  const commentBefore = async (p: NormalizedPosition) => {
    let text = p.commentBefore || ""
    let body = (
      <textarea onChange={(e) => text = e.target.value} defaultValue={text}/>
    )
    const r = await ctx.showConfirmation({body: body, title: "Comment before move", validateText: "Save", cancelText: "Cancel"})
    if (r) {
      setCommentBefore(p, text)
    }
  }
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
              <Menu.Item>
                <a className="dropdown-item" onClick={() => commentAfter(position)}>Comment after</a>
              </Menu.Item>
              <Menu.Item>
                <a className="dropdown-item" onClick={() => commentBefore(position)}>Comment before</a>
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
