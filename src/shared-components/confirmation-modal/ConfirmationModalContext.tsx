import React, {useContext, useRef, useState} from "react";
import useModal from "../UseModal";
import {ConfirmationModal, ConfirmationModalProps} from "./ConfirmationModal";
import {useHistory, useLocation} from "react-router-dom";

export type ConfirmationModalCustomizableProps = Partial<Omit<ConfirmationModalProps, "onValidate" | "onCancel" | "isOpen">>

const ConfirmationModalContext = React.createContext<{showConfirmation: (conf: ConfirmationModalCustomizableProps) => Promise<boolean>}>({
  showConfirmation: () => new Promise(resolve => resolve(false))
})

const ConfirmationModalContextProvider: React.FC = ({children}) => {
  const history = useHistory();
  const [isShowing, toggle] = useState(false)
  const resolver = useRef<(v: boolean) => void>()
  const [modalConf, setModalConf] = useState<ConfirmationModalCustomizableProps>({})
  const unlisten = useRef<() => void>()

  const handleShow = (conf:ConfirmationModalCustomizableProps): Promise<boolean> => {
    unlisten.current = history.listen(location => {
      handleClick(false)()
    })
    setModalConf(conf)
    toggle(true);
    return new Promise(resolve => resolver.current = resolve)
  }

  const handleClick = (res: boolean) => () => {
    if (unlisten.current) {
      unlisten.current()
    }
    if (resolver.current) {
      resolver.current(res)
    }
    toggle(false)
  }

  return(
    <ConfirmationModalContext.Provider value={{showConfirmation: handleShow}}>
      {children}
      <ConfirmationModal isOpen={isShowing} onCancel={handleClick(false)} onValidate={handleClick(true)} {...modalConf}/>
    </ConfirmationModalContext.Provider>
  )
}

export const useConfirmationModalContext = () => useContext(ConfirmationModalContext)
export default ConfirmationModalContextProvider
