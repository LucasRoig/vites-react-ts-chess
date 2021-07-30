import React from "react";
import {
  ConfirmationModalCustomizableProps,
  useConfirmationModalContext
} from "../confirmation-modal/ConfirmationModalContext";


interface DeleteButtonProps {
  modalTitle?: string, modalMessage?: string, onClick: () => void
}

const DeleteButton: React.FC<DeleteButtonProps> = ({modalTitle, modalMessage, onClick}) => {
  const modalConf: ConfirmationModalCustomizableProps = {
    validateText: "Delete",
    validateClass: "is-danger"
  }
  if (modalTitle) {
    modalConf.title = modalTitle
  }
  if (modalMessage) {
    modalConf.message = modalMessage
  }
  const confirmationModal = useConfirmationModalContext()
  const handleClick = async () => {
    const res = await confirmationModal.showConfirmation(modalConf)
    if (res) {
      onClick()
    }
  }

  return (
    <button className="button is-danger is-outlined is-small" onClick={handleClick}>
      <span>Delete</span>
      <span className="icon is-small">
        <i className="fas fa-times"/>
      </span>
    </button>
  )
}

export {
  DeleteButton
}
