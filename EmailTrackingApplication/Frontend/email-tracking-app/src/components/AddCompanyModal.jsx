import React, { useState } from 'react';
import './AddCompanyModal.css';
import { companiesAPI } from '../services/api';

export const AddCompanyModal = ({ isOpen, onClose, userId, onCompanyAdded }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    region: '',
    link: '',
    emails: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateEmails = (emails) => {
    if (!emails.trim()) return false;
    const emailList = emails.split(/[,;]/).map((e) => e.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailList.length > 0 && emailList.every((email) => emailRegex.test(email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.companyName.trim()) {
      setError('Company Name is required.');
      return;
    }
    if (!formData.region.trim()) {
      setError('Region is required.');
      return;
    }
    if (!validateEmails(formData.emails)) {
      setError('Please enter at least one valid email address.');
      return;
    }

    setLoading(true);

    try {
      // Check for duplicate
      const duplicateCheck = await companiesAPI.checkDuplicate(userId, formData.companyName);
      if (duplicateCheck.data.exists) {
        setError('This company already exists.');
        setLoading(false);
        return;
      }

      // Add company
      const response = await companiesAPI.addCompany(userId, {
        companyName: formData.companyName,
        region: formData.region,
        link: formData.link || null,
        emails: formData.emails,
      });

      if (response.success) {
        onCompanyAdded(response.data);
        setFormData({
          companyName: '',
          region: '',
          link: '',
          emails: '',
        });
        onClose();
      } else {
        setError(response.message || 'Error adding company.');
      }
    } catch (err) {
      setError('Error adding company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Client / Company</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Enter company name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="region">Region *</label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              placeholder="Enter region"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="link">Company Link</label>
            <input
              type="text"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="Enter company link (optional)"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="emails">Relevant Persons Emails *</label>
            <textarea
              id="emails"
              name="emails"
              value={formData.emails}
              onChange={handleInputChange}
              placeholder="Enter email(s), separated by commas or semicolons"
              rows="3"
              disabled={loading}
            />
            <small>Example: email1@domain.com, email2@domain.com</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
