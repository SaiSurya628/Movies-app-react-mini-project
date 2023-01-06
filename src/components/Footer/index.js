import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'

import './index.css'

const Footer = () => (
  <div className="footerPage">
    <div className="contact-iconContainer">
      <FaGoogle className="contact-icon" />
      <FaTwitter className="contact-icon" />
      <FaInstagram className="contact-icon" />
      <FaYoutube className="contact-icon" />
    </div>
    <p className="contact-text">Contact us</p>
  </div>
)

export default Footer
