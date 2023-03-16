import React from "react";
import { useModal } from "../../../../context/Modal";
import './stockPageModal.css'

function AddToWatchlistModalButton({
  modalComponent,
  buttonText,
  onButtonClick,
  onModalClose
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onButtonClick) onButtonClick();
  }

  return (
    <button className='watchlist-button' onClick={onClick}>{buttonText}</button>
  )
}

export default AddToWatchlistModalButton;
