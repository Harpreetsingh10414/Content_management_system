// Header.js
import React from 'react';
import './Header.css';  // We'll create a separate CSS file for styling
import { Link } from 'react-router-dom'; 

const Header = () => {
  return (
    <header className="header">
      <h1>Logo</h1>
      <nav>
        <ul  style={{marginRight:'30px'}}>
        <li><Link to="/create-step">steps</Link></li> 
        <li><Link to="/add-onepoint-lesson">one-p-l</Link></li> 
        <li><Link to="/add-parts">Parts</Link></li> 
        <li><Link to="/add-tool">Tools</Link></li> 
        <li><Link to="/add-product">Product</Link></li> 
        <li><Link to="/tabs">Log out</Link></li> 

        </ul>
      </nav>
    </header>
  );
};

export default Header;
