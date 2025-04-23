import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './index.css';

const CreateNewBlog = ({ onClose, onSave, fullName }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    description: '',
    coverImage: '',
  });

  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName) {
      setError('Author information is missing. Cannot save post.');
      return;
    }

    if (!newBlog.title.trim()) {
      setError('Title is required.');
      return;
    }

    if (!newBlog.description.trim()) {
      setError('Description is required.');
      return;
    }

    if (!newBlog.coverImage.trim()) {
      setError('Cover Image URL is required.');
      return;
    }

    setIsSaving(true);

    const payload = {
      title: newBlog.title,
      description: newBlog.description,
      coverImage: newBlog.coverImage,
      author: fullName,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/blogs', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        onSave(response.data);
      } else {
        setError(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      let errorMessage = 'An error occurred while saving the post.';
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Cannot connect to the server. Please check your network or the API URL.';
      } else {
        errorMessage = `Error: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Create New Blog</h2>
          <button className="close-button" onClick={onClose} disabled={isSaving}>
            <FaTimes />
          </button>
        </div>

        {error && <p className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={newBlog.title} onChange={handleChange} required disabled={isSaving} />
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Cover Image URL</label>
            <input type="url" id="coverImage" name="coverImage" value={newBlog.coverImage} onChange={handleChange} placeholder="https://..." required disabled={isSaving} />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={newBlog.description}
              onChange={handleChange}
              rows="10"
              required
              disabled={isSaving}
            ></textarea>
          </div>

          {/* Hiển thị tên tác giả (nếu có) */}
          {fullName && (
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <strong>Author:</strong> {fullName}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isSaving}>Cancel</button>
            <button type="submit" className="save-btn" disabled={isSaving || !fullName}>
              {isSaving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewBlog;
