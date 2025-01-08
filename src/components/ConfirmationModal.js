import React from 'react';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
	return (
		<div className="confirmation-modal">
			<div className="confirmation-modal-content">
				<p>{message}</p>
				<div className="confirmation-buttons">
					<button onClick={onConfirm} className="confirm-button">Ναι</button>
					<button onClick={onCancel} className="cancel-button">Όχι</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;