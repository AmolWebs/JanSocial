import React from 'react'
import axios from 'axios'
import { useContext } from 'react';
import { JanContext } from '../context/JanContext';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';

const Login = () => {



  const { backendUrl, loginFunction, navigate, checkUser, location } = useContext(JanContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${backendUrl}/api/user/login`, {
      username, password
    });

    if (response.data.success) {
      loginFunction(response.data.user.UID);
      navigate("/");
      console.log(localStorage.getItem('UID'))
    }
    else {
      console.log("Invalid Credentials");
    }

  }
  useEffect(() => {
    checkUser()
  }, [])

  return (
    <div>
      <form onSubmit={(e) => loginSubmit(e)} >
        <input type="text" name='username' onInput={(e) => setUsername(e.target.value)} placeholder='Enter Username' />
        <input type="text" name='password' onInput={(e) => setPassword(e.target.value)} placeholder='Enter Password' />
        <button type='submit' >Log In</button>
        <NavLink to="/register" >Create new account</NavLink>

      </form>
    </div>
  )
}

export default Login
