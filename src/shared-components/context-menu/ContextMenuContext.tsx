import React, {ReactNode, useCallback, useContext, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {Menu} from "@headlessui/react";
import {BlockTypeNames} from "../../libraries/text-editor/Models";

export const ContextMenuContext = React.createContext<{
  handleContextMenu: (e: React.MouseEvent<HTMLElement, MouseEvent>, menu: ReactNode) => void,
}>({
  handleContextMenu: e => {}
})

const ContextMenuProvider: React.FC = ({children}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [menu, setMenu] = useState<ReactNode>(null)
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>, menu: ReactNode) => {
      event.preventDefault();
      setMenu(menu)
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      setIsOpen(true);
    },
    [setIsOpen, setAnchorPoint]
  );

  const closeMenu = useCallback(() => {
    if (setIsOpen) {
      setIsOpen(false)
    }
  }, [setIsOpen])

  useEffect(() => {
    document.addEventListener("click", closeMenu)
    return () => {
        document.removeEventListener("click", closeMenu)
    }
  }, [closeMenu])

  return (
    <ContextMenuContext.Provider value={{
      handleContextMenu,
    }}>
      {children}
      {isOpen && ReactDOM.createPortal(
        <div style={{position: "absolute", top: anchorPoint.y + "px", left: anchorPoint.x + "px"}}>
          {menu}
        </div>
        , document.body
      )}

      {/*<ContextMenu isOpen={isOpen} anchor={anchorPoint}/>*/}
    </ContextMenuContext.Provider>
  )
}

// const ContextMenu: React.FC<{isOpen: boolean, anchor: {x: number, y: number}}> = ({isOpen, anchor}) => {
//   return isOpen ? ReactDOM.createPortal(
//       <Menu>
//         <div className={"dropdown is-active"} style={{marginRight: "1rem", position: "absolute", top: anchor.y + "px", left: anchor.x + "px"}}>
//           <Menu.Items static>
//             <div className={"dropdown-menu"}>
//               <div className={"dropdown-content"}>
//                 <p className="dropdown-item"><b>Turn into</b></p>
//                 <Menu.Item>
//                   <a className={`dropdown-item`}
//                      >ChessGame</a>
//                 </Menu.Item>
//                 <Menu.Item>
//                   <a className={`dropdown-item`}
//                      >Text</a>
//                 </Menu.Item>
//                 <Menu.Item>
//                   <a className={`dropdown-item`}
//                      >Heading 1</a>
//                 </Menu.Item>
//                 <Menu.Item>
//                   <a className={`dropdown-item`}
//                      >Heading 2</a>
//                 </Menu.Item>
//                 <Menu.Item>
//                   <a className={`dropdown-item`}
//                      >Heading 3</a>
//                 </Menu.Item>
//                 <Menu.Item>
//                   <a className={`dropdown-item`}>Bullet List</a>
//                 </Menu.Item>
//                 <hr className="dropdown-divider"/>
//                 <Menu.Item>
//                   <a className="dropdown-item" >Delete</a>
//                 </Menu.Item>
//               </div>
//             </div>
//           </Menu.Items>
//         </div>
//       </Menu>
//     // <div style={{position: "absolute", top: anchor.y + "px", left: anchor.x + "px"}}>ContextMenu</div>
//     , document.body) : null
// }
const useContextMenuContext = () => useContext(ContextMenuContext);
export {
  useContextMenuContext,
  ContextMenuProvider
}
