// Header.js
import React from 'react';
import './Header.css';  // We'll create a separate CSS file for styling
import { Link } from 'react-router-dom'; 

const Header = () => {
  return (
    <header className="header">
      <h1>Logo</h1>
      <nav>
        <ul style={{marginRight:'30px'}}> 
          {/* <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>*/}
          <li><Link to="/create-step">Login</Link></li> 
        </ul>
      </nav>
    </header>
  );
};

export default Header;
