import React, { useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { JanContext } from '../context/JanContext'

const Navbar = () => {

    const {user, logoutFunction, validateUser} = useContext(JanContext);
    useEffect(()=>{
        validateUser();
    },[])

  return (
    <div>
      <div className="web-logo">
        <h1>JanSocial</h1>
      </div>
      <div>
        <NavLink to='/createPost' >Create Post</NavLink>
        <br />
        <NavLink to='/profile' >Profile</NavLink>
        <button onClick={()=>logoutFunction()} >Log Out</button>
      </div>
    </div>
  )
}

export default Navbar
