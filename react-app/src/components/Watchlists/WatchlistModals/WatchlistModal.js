import React from 'react';
import { useModal } from '../../../context/Modal'
import './watchlistModal.css'

function WatchlistModalButton({
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
    <button className='watchlist-modal-button' onClick={onClick}>{buttonText}</button>
  )
}

export default WatchlistModalButton;
