import React, { useContext, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { JanContext } from '../context/JanContext';
import './Register.css'; // external CSS
import { toast } from 'react-toastify';

const Register = () => {
  const { navigate, loginFunction, backendUrl } = useContext(JanContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const registerSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${backendUrl}/api/user/register`, {
      username,
      password,
    });
  
    if (response.data.success) {
      loginFunction(response.data.user.UID);
      toast.success("Account Created Successfully")
      navigate('/');
    } else {
      toast.error("Username already exists. Please change username")
      console.log("HI" + response.error)
    }
    
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={registerSubmit}>
        <h2>Create Account</h2>
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
        <button type="submit">Sign Up</button>
        <p>
          Already have an account?{' '}
          <NavLink to="/login" className="login-link">
            Log In
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Register;
