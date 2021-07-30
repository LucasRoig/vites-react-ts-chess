import React, {useContext, useRef, useState} from "react";
import useModal from "../UseModal";
import {ConfirmationModal, ConfirmationModalProps} from "./ConfirmationModal";

export type ConfirmationModalCustomizableProps = Partial<Omit<ConfirmationModalProps, "onValidate" | "onCancel" | "isOpen">>

const ConfirmationModalContext = React.createContext<{showConfirmation: (conf: ConfirmationModalCustomizableProps) => Promise<boolean>}>({
  showConfirmation: () => new Promise(resolve => resolve(false))
})

const ConfirmationModalContextProvider: React.FC = ({children}) => {
  const [isShowing, toggle] = useModal()
  const resolver = useRef<(v: boolean) => void>()
  const [modalConf, setModalConf] = useState<ConfirmationModalCustomizableProps>({})

  const handleShow = (conf:ConfirmationModalCustomizableProps): Promise<boolean> => {
    setModalConf(conf)
    toggle();
    return new Promise(resolve => resolver.current = resolve)
  }

  const handleClick = (res: boolean) => () => {
    if (resolver.current) {
      resolver.current(res)
    }
    toggle()
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
