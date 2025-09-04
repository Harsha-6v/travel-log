import React from 'react';
import { useForm } from 'react-hook-form';

const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    onConfirm(data.apiKey);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
      <h4>Confirm Deletion</h4>
      <p>Please enter your API Key to delete this entry.</p>
      <label htmlFor="apiKey">API KEY</label>
      <input type="password" name="apiKey" required ref={register} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <button type="button" onClick={onCancel} style={{ backgroundColor: '#ccc', color: 'black', border: 'none', padding: '8px', cursor: 'pointer' }}>
          Cancel
        </button>
        <button type="submit" style={{ backgroundColor: '#f05305', color: 'white', border: 'none', padding: '8px', cursor: 'pointer' }}>
          Confirm Delete
        </button>
      </div>
    </form>
  );
};

export default DeleteConfirmation;