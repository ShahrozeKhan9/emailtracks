import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { authAPI } from '../services/api';
import { authUtils } from '../services/authUtils';

export const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!credentials.usernameOrEmail.trim() || !credentials.password.trim()) {
      setError('Please enter both username/email and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(
        credentials.usernameOrEmail,
        credentials.password
      );

      if (response.success) {
        const user = {
          userId: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          isDirector: response.data.isDirector,
        };

        authUtils.setUser(user);
        onLoginSuccess(user);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Invalid username/email or password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Email Tracking Application</h1>
          <p>Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Username or Email</label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={credentials.usernameOrEmail}
              onChange={handleInputChange}
              placeholder="Enter your username or email"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {error && <div className="error-alert">{error}</div>}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

       
      </div>
    </div>
  );
};
