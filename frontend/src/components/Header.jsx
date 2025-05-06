// Header.js
import React from 'react';
import { Link } from "react-router-dom";

export const Header = () => {
    return (
        <div className="w-full max-w-none flex justify-between items-center px-6 py-4 bg-blue-700 text-white shadow rounded-b-lg rounded-t-lg">
            <h1 className="text-xl font-bold">Your Logo</h1>
            <nav className="space-x-4">
                <Link to="/" className="hover:underline">Home</Link>
                <Link to="/compare-prices" className="hover:underline">Login</Link>
                <Link to="/blogs" className="hover:underline">Blogs</Link>
                <Link to="/deals" className="hover:underline">Deals</Link>
            </nav>
        </div>
    );
};
