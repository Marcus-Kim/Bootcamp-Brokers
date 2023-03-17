import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useModal } from '../../../context/Modal'
import './watchlistModal.css'
import { faCircleXmark, faGear } from '@fortawesome/free-solid-svg-icons';

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
    <button className='watchlist-modal-button' onClick={onClick}>{buttonText == 'Edit List' ? <FontAwesomeIcon icon={faGear}/> : <FontAwesomeIcon icon={faCircleXmark}/>} {buttonText}</button>
  )
}

export default WatchlistModalButton;
