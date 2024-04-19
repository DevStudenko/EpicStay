import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpot } from '../../store/spots';

import './DeleteSpotModal.css'

const DeleteSpotModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  
  const handleDeleteSpot = () => {
    dispatch(deleteSpot(spotId))
      .then(closeModal)

  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this spot?</p>
        <div className="modal-buttons">
          <button id='yes' onClick={() => handleDeleteSpot()}>Yes</button>
          <button id='no' onClick={(closeModal)}>No</button>
        </div>
      </div>
    </div>
  );
}


export default DeleteSpotModal