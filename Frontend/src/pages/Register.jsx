import React from 'react'
import axios from 'axios'
import { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { JanContext } from '../context/JanContext'

const Register = () => {

    const {navigate, loginFunction, backendUrl} = useContext(JanContext);

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const registerSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post(`${backendUrl}/api/user/register`, {
            username, password
        });

        if(response.data.success){
            loginFunction(response.data.user.UID);
            navigate("/")   
        }

        else{
            console.log(response)
        }
    }
  return (
    <div>
      <form onSubmit={(e)=>registerSubmit(e)} >
        <input type="text" name='username' onInput={(e)=>setUsername(e.target.value)} placeholder='Enter Username' />
        <input type="text" name='password' onInput={(e)=>setPassword(e.target.value)} placeholder='Enter Password' />
        <button type='submit' >Sign Up</button>
        <NavLink to="/login" >Already have a account</NavLink>

      </form>
    </div>
  )
}

export default Register
