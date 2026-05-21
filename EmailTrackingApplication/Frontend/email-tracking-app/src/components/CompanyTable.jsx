import React, { useState } from 'react';
import './CompanyTable.css';
import { companiesAPI } from '../services/api';

export const CompanyTable = ({
  companies,
  userId,
  isDirector,
  onCompanyUpdated,
  onCompanyDeleted,
  onShowToast,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const canEdit = (company) => isDirector || company.userId === userId;

  const parseEmails = (emailString) => {
    if (!emailString) return [];
    return emailString.split(/[,;]/).map((email) => email.trim()).filter((email) => email);
  };

  const handleEditClick = (company) => {
    if (canEdit(company)) {
      setEditingId(company.id);
      setEditingData({ ...company });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (company) => {
    setLoading(true);
    try {
      const response = await companiesAPI.updateCompany(
        company.id,
        userId,
        isDirector,
        {
          companyName: editingData.companyName,
          region: editingData.region,
          link: editingData.link,
          emails: editingData.emails,
          painPoints: editingData.painPoints,
          exactNeeds: editingData.exactNeeds,
          buyingTrigger: editingData.buyingTrigger,
          bestPitchAngle: editingData.bestPitchAngle,
          whyStrongFit: editingData.whyStrongFit,
          status: editingData.status,
        }
      );

      if (response.success) {
        onCompanyUpdated();
        setEditingId(null);
        onShowToast('Company updated successfully.', 'success');
      } else {
        onShowToast(response.message || 'Error updating company.', 'error');
      }
    } catch (err) {
      onShowToast('Error updating company. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (company) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      setLoading(true);
      try {
        const response = await companiesAPI.deleteCompany(company.id, userId, isDirector);

        if (response.success) {
          onCompanyDeleted();
          onShowToast('Company deleted successfully.', 'success');
        } else {
          onShowToast(response.message || 'Error deleting company.', 'error');
        }
      } catch (err) {
        onShowToast('Error deleting company. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendMail = async (company) => {
    const isFilled =
      company.painPoints &&
      company.exactNeeds &&
      company.buyingTrigger &&
      company.bestPitchAngle &&
      company.whyStrongFit;

    if (!isFilled) {
      onShowToast('Please fill all required columns before sending mail.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await companiesAPI.markAsPending(company.id, userId, isDirector);

      if (response.success) {
        onCompanyUpdated();
        onShowToast('Status updated to Pending.', 'success');
      } else {
        onShowToast(response.message || 'Error updating status.', 'error');
      }
    } catch (err) {
      onShowToast('Error updating status. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    'Not Sent',
    'Pending',
    'Sent',
    'Responded',
    'Follow-up Required',
    'Closed',
  ];

  return (
    <div className="table-container">
      {companies.length === 0 ? (
        <div className="empty-state">
          <p>No companies found. Add your first company to get started!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="company-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Company Name</th>
                <th>Region</th>
                <th>Emails</th>
                <th>Pain Points</th>
                <th>Exact Needs</th>
                <th>Buying Trigger</th>
                <th>Best Pitch Angle</th>
                <th>Why Strong Fit</th>
                <th>Send Mail</th>
                <th>Status</th>
                {isDirector && <th>Username</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.id}
                  className={editingId === company.id ? 'editing' : ''}
                >
                  <td className="id-cell">{company.id}</td>
                  <td className="company-name-cell">
                    {editingId === company.id && canEdit(company) ? (
                      <input
                        type="text"
                        name="companyName"
                        value={editingData.companyName}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    ) : company.link ? (
                      <a
                        href={company.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="company-link"
                      >
                        {company.companyName}
                      </a>
                    ) : (
                      company.companyName
                    )}
                  </td>
                  <td>
                    {editingId === company.id && canEdit(company) ? (
                      <input
                        type="text"
                        name="region"
                        value={editingData.region}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    ) : (
                      company.region
                    )}
                  </td>
                  <td
                    className="emails-cell"
                  >
                    {editingId === company.id && canEdit(company) ? (
                      <textarea
                        name="emails"
                        value={editingData.emails}
                        onChange={handleInputChange}
                        disabled={loading}
                        rows="2"
                      />
                    ) : (
                      <div className="emails-container">
                        {parseEmails(company.emails).map((email) => (
                          <div key={email} className="email-badge">
                            {email}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td>
                    {editingId === company.id && canEdit(company) ? (
                      <input
                        type="text"
                        name="painPoints"
                        value={editingData.painPoints || ''}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    ) : (
                      company.painPoints || '-'
                    )}
                  </td>
                  <td>
                    {editingId === company.id && canEdit(company) ? (
                      <input
                        type="text"
                        name="exactNeeds"
                        value={editingData.exactNeeds || ''}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    ) : (
                      company.exactNeeds || '-'
                    )}
                  </td>
                  <td>
                    {editingId === company.id && canEdit(company) ? (
                      <input
                        type="text"
                        name="buyingTrigger"
                        value={editingData.buyingTrigger || ''}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    ) : (
                      company.buyingTrigger || '-'
                    )}
                  </td>
                  <td>
                    {editingId === company.id && canEdit(company) ? (
                      <input
                        type="text"
                        name="bestPitchAngle"
                        value={editingData.bestPitchAngle || ''}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    ) : (
                      company.bestPitchAngle || '-'
                    )}
                  </td>
                  <td>
                    {editingId === company.id && canEdit(company) ? (
                      <input
                        type="text"
                        name="whyStrongFit"
                        value={editingData.whyStrongFit || ''}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    ) : (
                      company.whyStrongFit || '-'
                    )}
                  </td>
                  <td className="send-mail-cell">
                    <button
                      className="send-mail-button"
                      onClick={() => handleSendMail(company)}
                      disabled={
                        !canEdit(company) ||
                        loading ||
                        !company.painPoints ||
                        !company.exactNeeds ||
                        !company.buyingTrigger ||
                        !company.bestPitchAngle ||
                        !company.whyStrongFit
                      }
                      title={
                        !company.painPoints ||
                        !company.exactNeeds ||
                        !company.buyingTrigger ||
                        !company.bestPitchAngle ||
                        !company.whyStrongFit
                          ? 'Fill all columns first'
                          : 'Click to mark as pending'
                      }
                    >
                      Send
                    </button>
                  </td>
                  <td>
                    {editingId === company.id && canEdit(company) ? (
                      <select
                        name="status"
                        value={editingData.status}
                        onChange={handleInputChange}
                        disabled={loading}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`status-badge status-${company.status
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        {company.status}
                      </span>
                    )}
                  </td>
                  {isDirector && (
                    <td className="username-cell">{company.username}</td>
                  )}
                  <td className="actions-cell">
                    {editingId === company.id && canEdit(company) ? (
                      <div className="action-buttons">
                        <button
                          className="button-save"
                          onClick={() => handleSave(company)}
                          disabled={loading}
                        >
                          Save
                        </button>
                        <button
                          className="button-cancel"
                          onClick={() => setEditingId(null)}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        {canEdit(company) && (
                          <>
                            <button
                              className="button-edit"
                              onClick={() => handleEditClick(company)}
                              disabled={loading}
                            >
                              Edit
                            </button>
                            <button
                              className="button-delete"
                              onClick={() => handleDelete(company)}
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {!canEdit(company) && <span className="readonly">View</span>}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
