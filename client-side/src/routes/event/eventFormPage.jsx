import React, { useState } from "react";
import "./EventFormPage.css";

const EventFormPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    excitement: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Event Submitted!"); // Placeholder for form submission
    setFormData({
      name: "",
      date: "",
      excitement: "",
      notes: "",
    });
  };

  return (
    <div className="form-container">
      <h1 className="form-title">🎉 Create Your Event 🎈</h1>
      <form onSubmit={handleSubmit} className="event-form">
        <label className="form-label">
          Event Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>
        <label className="form-label">
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>
        <label className="form-label">
          Excitement (1-10):
          <input
            type="number"
            name="excitement"
            min="1"
            max="10"
            value={formData.excitement}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>
        <label className="form-label">
          Notes:
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-textarea"
            required
          />
        </label>
        <button type="submit" className="form-button">
          💾 Save Event
        </button>
      </form>
    </div>
  );
};

export default EventFormPage;
