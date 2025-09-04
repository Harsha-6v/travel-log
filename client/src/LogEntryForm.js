import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createLogEntry, updateLogEntry } from './API';
const LogEntryForm = ({ location, entry, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = !!entry; // Check if we are in "edit" mode

  const { register, handleSubmit } = useForm({
    defaultValues: isEditing ? {
      apiKey: '', // API Key should not be pre-filled
      title: entry.title,
      comments: entry.comments,
      description: entry.description,
      image: entry.image,
      visitDate: new Date(entry.visitDate).toISOString().split('T')[0],
    } : {},
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isEditing) {
        // Update existing entry
        await updateLogEntry(entry._id, data);
      } else {
        // Create new entry
        data.latitude = location.latitude;
        data.longitude = location.longitude;
        await createLogEntry(data);
      }
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="popup-form">
      { error ? <h3 className="error">{error}</h3> : <h4>{isEditing ? 'Edit Entry' : 'Create New Entry'}</h4>}
      <label htmlFor="apiKey">API KEY</label>
      <input type="password" name="apiKey" required ref={register} />
      <label htmlFor="title">Title</label>
      <input name="title" required ref={register} />
      <label htmlFor="comments">Comments</label>
      <textarea name="comments" rows={3} ref={register}></textarea>
      <label htmlFor="description">Description</label>
      <textarea name="description" rows={3} ref={register}></textarea>
      <label htmlFor="image">Image URL</label>
      <input name="image" ref={register} />
      <label htmlFor="visitDate">Visit Date</label>
      <input name="visitDate" type="date" required ref={register} />
      <button className="btn-primary" disabled={loading}>
        {loading ? 'Loading...' : isEditing ? 'Update Entry' : 'Create Entry'}
      </button>
    </form>
  );
};

export default LogEntryForm;