import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

export default function NavBar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Travel Buddy</Link>
      </div>
      <ul className="navbar-links">
        {user ? (
          <>
            <li><Link to="/">Plan a Trip</Link></li>
            <li><Link to="/my-trips">Your Trips</Link></li> {/* New link */}
            <li><span className="navbar-user">Hello, {user.name}!</span></li>
            <li><button onClick={onLogout} className="navbar-button">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="navbar-button">Login</Link></li>
            <li><Link to="/signup" className="navbar-button">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
