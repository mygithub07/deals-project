// Header.js
import React from 'react';
import { Link } from "react-router-dom";

export const Header = () => {
    return (
        // <div className="w-full max-w-none flex justify-between items-center px-6 text-white shadow">
        <div className="w-full max-w-none h-14 bg-blue-800 border-t flex items-center justify-between px-6 text-sm rounded-t-lg rounded-b-lg">
            <nav className="space-x-4">
                <Link to="/" className="!text-white hover:underline">Home</Link>
                <Link to="/compare-prices" className="!text-white hover:underline">Login</Link>
                <Link to="/blogs" className=" !text-white hover:underline">Blogs</Link>
                <Link to="/deals" className=" !text-white hover:underline">Deals</Link>
            </nav>
        </div>
    );
};
