import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

export const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    return (
        <section className="hero">
            <h2>Find the Best Prices on Groceries & Retail Products</h2>
            <p>Compare prices across top stores and save money!</p>
            <input
                type="text"
                placeholder="Search for a product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
         { /*  <button className="compare-btn" onClick={handleCompareClick}>
                Compare Prices
            </button> */}

            <button
                className="compare-btn"
                onClick={(e) => {
                    e.preventDefault();
                    navigate("/compare-prices", { state: nanoid() });
                }}
            >
                Compare Prices
            </button>

        </section>
    );
};

//export default HeroSection;
