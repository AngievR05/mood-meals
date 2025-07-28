import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import bgImage from '../assets/images/background.jpg';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      {/* Overlay div for darkening background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 0,
        }}
      ></div>

      {/* Form content, above overlay */}
      <form
        className="auth-card"
        onSubmit={handleSubmit}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-button">
          Login
        </button>

        <p className="auth-link">
          Don’t have an account?{' '}
          <span onClick={() => navigate('/register')}>Register</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
