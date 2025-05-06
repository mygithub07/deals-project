import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

export const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    return (
        <section className="w-full bg-gray-100 py-10 px-6">
            <h2 className="text-2xl font-semibold mb-2">Find the Best Prices on Groceries & Retail Products</h2>
            <p className="mb-4 text-gray-700">Compare prices across top stores and save money!</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
                <input
                    type="text"
                    placeholder="Search for a product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border border-gray-300 p-2 rounded"
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/compare-prices", { state: nanoid() });
                    }}
                >
                    Compare Prices
                </button>
            </div>
        </section>
    );
};
