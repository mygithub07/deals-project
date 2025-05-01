import React, { useState } from "react";

const Sidebar = ({ data, setSelectedCategory }) => {
    const categories = data || {};
    const [expandedCategories, setExpandedCategories] = useState({});

    const toggleCategory = (category) => {
        setExpandedCategories((prev) => ({
            [category]: !prev[category] ? true : !prev[category], // Close others when clicking a new one
        }));
    };

    return (
        <div className="sidebar-container">
            <h3>Categories</h3>
            <ul className="categoryList">
                {Object.keys(categories).length > 0 ? (
                    Object.entries(categories).map(([category, subcategories]) => (
                        <li key={category}>
                            {/* Main Category */}
                            <div
                                className={`category ${expandedCategories[category] ? "expanded" : ""}`}
                                onClick={() => {
                                    toggleCategory(category);
                                    setSelectedCategory({ type: "category", name: category });
                                }}
                            >
                                {category}
                                <span>{expandedCategories[category] ? "▼" : "▶"}</span>
                            </div>

                            {/* Subcategories */}
                            {expandedCategories[category] && (
                                <ul className="subcategoryList">
                                    {subcategories.map((subcategory) => (
                                        <li
                                            key={subcategory}
                                            className="subcategory"
                                            onClick={() => setSelectedCategory({ type: "subcategory", name: subcategory })}
                                        >
                                            <span className="arrow">▶</span> {subcategory}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))
                ) : (
                    <li>No categories available</li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
