import React, { useState } from "react";

const Sidebar = ({ data, setSelectedCategory }) => {
    const categories = data || {};
    const [expandedCategories, setExpandedCategories] = useState({});
    const [selected, setSelected] = useState("All");

    const toggleCategory = (category) => {
        setExpandedCategories((prev) => ({
            [category]: !prev[category] ? true : !prev[category], // Close others when clicking a new one
        }));
        setSelected(category);
    };

    return (
        <div className="category-menu">
            <h3>Categories</h3>
            <ul className="categoryList">
                {/* "All Deals" Option */}
                <li>
                    <div
                        className={`category ${selected === "All" ? "selected" : ""}`}
                        onClick={() => {
                            setSelected("All");
                            setSelectedCategory({ type: "all", name: "All Deals" });
                            setExpandedCategories({}); // Collapse all categories
                        }}
                    >
                        All Deals
                    </div>
                </li>

                {/* Render Categories */}
                {Object.keys(categories).length > 0 ? (
                    Object.entries(categories).map(([category, subcategories]) => (
                        <li key={category}>
                            {/* Main Category */}
                            <div
                                className={`category ${expandedCategories[category] ? "expanded" : ""} ${selected === category ? "selected" : ""}`}
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
                                            className={`subcategory ${selected === subcategory ? "selected" : ""}`}
                                            onClick={() => {
                                                setSelected(subcategory);
                                                setSelectedCategory({ type: "subcategory", name: subcategory });
                                            }}
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
