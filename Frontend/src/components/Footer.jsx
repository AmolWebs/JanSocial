import React from 'react'
import { assets } from '../assets/assets'
import './Footer.css'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='main-footer' >
      <div className="left-footer">
      <img className='footer-logo' src={assets.logo} alt="" />
        <p>This app is designed to Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, adipisci. Commodi, incidunt soluta. Voluptates inventore numquam repellendus iure velit, tenetur sequi? Eaque pariatur voluptatem laboriosam quas placeat magnam porro minima?
        </p>
      </div>
      <div className="right-footer">
        <div className="footer-links">
          <p>Links</p>
          <div className="links">

          <NavLink to="/" >Posts</NavLink>
          <NavLink to="/createPost" >Create Post</NavLink>
          <NavLink to="/profile" >Profile</NavLink>
          </div>
          <div className="copyright">
            <p>© 2025 JanSocial. Built with ❤️ to make voices heard.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
