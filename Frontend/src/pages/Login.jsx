import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { JanContext } from '../context/JanContext';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {

  const { backendUrl, loginFunction, navigate, checkUser } = useContext(JanContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${backendUrl}/api/user/login`, { username, password });

    if (response.data.success) {
      loginFunction(response.data.user.UID);
      navigate('/');
      toast.success("Logged in successfully 🎉");
    } else {
      toast.error("Invalid Credentials ❌");
    }
  };

  useEffect(() => {
    checkUser();
    
  }, []);

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={loginSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          value={username}
          onInput={(e) => setUsername(e.target.value)}
          placeholder="Enter Username"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onInput={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          required
        />
        <button type="submit">Log In</button>
        <p>
          Don't have an account?{" "}
          <NavLink to="/register" className="register-link">
            Create Account
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Login;
