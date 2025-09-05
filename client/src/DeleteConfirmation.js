import React from 'react';
import { useForm } from 'react-hook-form';

const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    onConfirm(data.apiKey);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="popup-form">
      <h4>Confirm Deletion</h4>
      <p>Please enter your PASS Key to delete this entry.</p>
      <label htmlFor="apiKey">PASS KEY</label>
      <input type="password" name="apiKey" required ref={register} />
      <div className="popup-buttons-container">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-danger">
          Confirm Delete
        </button>
      </div>
    </form>
  );
};

export default DeleteConfirmation;