import React, { useState } from 'react';
import './NewsForm.css';

const CATEGORIES = ['Politics', 'Technology', 'Sports', 'Entertainment', 'Business', 'Health', 'World'];

export default function NewsForm({ initialData = {}, onSubmit, loading, submitLabel = 'Publish' }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    category: initialData.category || '',
    author: initialData.author || '',
  });
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.image || null);
  const [videoPreview, setVideoPreview] = useState(initialData.video || null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('category', form.category);
    formData.append('author', form.author);
    if (image) formData.append('image', image);
    if (video) formData.append('video', video);
    onSubmit(formData);
  };

  return (
    <form className="news-form" onSubmit={handleSubmit}>
      <div className="news-form__row">
        <div className="news-form__field">
          <label className="news-form__label">Headline *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="news-form__input"
            placeholder="Enter a compelling headline…"
            required
          />
        </div>
      </div>

      <div className="news-form__row news-form__row--half">
        <div className="news-form__field">
          <label className="news-form__label">Author *</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            className="news-form__input"
            placeholder="Author name"
            required
          />
        </div>
        <div className="news-form__field">
          <label className="news-form__label">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="news-form__input news-form__select"
          >
            <option value="">Select category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="news-form__field">
        <label className="news-form__label">Story *</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="news-form__input news-form__textarea"
          placeholder="Write the full story here…"
          rows={10}
          required
        />
      </div>

      {/* Media Upload */}
      <div className="news-form__row news-form__row--half">
        <div className="news-form__field">
          <label className="news-form__label">Cover Image</label>
          <label className="news-form__upload-zone">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="news-form__preview-img" />
            ) : (
              <div className="news-form__upload-placeholder">
                <span className="news-form__upload-icon">🖼</span>
                <span>Click to upload image</span>
                <small>JPG, PNG, WEBP</small>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="news-form__file-input"
            />
          </label>
        </div>

        <div className="news-form__field">
          <label className="news-form__label">Video</label>
          <label className="news-form__upload-zone">
            {videoPreview ? (
              <video src={videoPreview} controls className="news-form__preview-img" />
            ) : (
              <div className="news-form__upload-placeholder">
                <span className="news-form__upload-icon">🎥</span>
                <span>Click to upload video</span>
                <small>MP4, MOV, WEBM</small>
              </div>
            )}
            <input
              type="file"
              accept="video/*"
              onChange={handleVideo}
              className="news-form__file-input"
            />
          </label>
        </div>
      </div>

      <button type="submit" className="news-form__submit" disabled={loading}>
        {loading ? (
          <span className="news-form__spinner" />
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
