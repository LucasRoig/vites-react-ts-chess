import React, {ReactNode} from "react";
import ReactDOM from "react-dom";

export interface ConfirmationModalProps {
  isOpen: boolean,
  onValidate: () => void
  onCancel: () => void
  body?: ReactNode
  title?: string
  message?: string
  validateText?: string
  cancelText?: string
  validateClass?: string
  cancelClass?: string
}

export const ConfirmationModal: React.FunctionComponent<ConfirmationModalProps> =
  ({
     isOpen,
     onValidate,
     onCancel,
     title = "Confirmation",
     message = "Are you sure ?",
    body,
    validateText= "Validate",
    cancelText = "Cancel",
    validateClass = "is-success",
    cancelClass = ""
   }) => {
    return isOpen ? ReactDOM.createPortal(
      <div className="modal is-active">
        <div className="modal-background"/>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{title}</p>
          </header>
          <section className="modal-card-body">
            {body || message}
          </section>
          <footer className="modal-card-foot">
            <button className={`button ${validateClass}`} onClick={onValidate}>{validateText}</button>
            <button className={`button ${cancelClass}`} onClick={onCancel}>{cancelText}</button>
          </footer>
        </div>
      </div>,
      document.body
    ) : null
  }
