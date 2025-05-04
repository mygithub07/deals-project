// Header.js
import React from 'react';
import { Link } from "react-router-dom";

export const Header = () => {
    return (
        <div className="header">
            <div className="header-container">
                <h1>Your Logo</h1>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/compare-prices">Login</Link>
                    <Link to="/blogs">Blogs</Link>
                    <Link to="/deals">Deals</Link> {/* Updated Link */}
                </nav>
            </div>
        </div>
    );
};
