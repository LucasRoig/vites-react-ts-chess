import React, {ReactNode} from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean,
  hide: () => void,
  title: string,
  buttons: ReactNode,
  content: ReactNode
}

const Modal : React.FunctionComponent<ModalProps> = ({isOpen, hide, title, buttons, content}) => {
  return isOpen ? ReactDOM.createPortal(
    <div className="modal is-active">
      <div className="modal-background" onClick={hide}/>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button className="delete" aria-label="close" onClick={hide}/>
        </header>
        <section className="modal-card-body">
          {content}
        </section>
        <footer className="modal-card-foot">
          {buttons}
        </footer>
      </div>
    </div>,
    document.body
  ) : null
}

export {
  Modal
}
