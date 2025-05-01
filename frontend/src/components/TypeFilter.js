import React, { useState, useEffect } from "react";
import { fetchTypes } from "./api";

const TypeFilter = ({ setSelectedType }) => {
    const [types, setTypes] = useState([]);
    const [selected, setSelected] = useState("All Types");

    useEffect(() => {
        const getTypes = async () => {
            try {
                const response = await fetchTypes();
                setTypes(response);
            } catch (error) {
                console.error("Error fetching types:", error);
            }
        };
        getTypes();
    }, []);

    return (
        <div className="type-menu">
            <h3 className="type-menu-title">Type</h3>
            <ul className="type-menu-list">
                <li>
                    <div
                        className={`type-item ${selected === "All Types" ? "selected" : ""}`}
                        onClick={() => {
                            setSelected("All Types");
                            setSelectedType(null);
                        }}
                    >
                        All Types
                    </div>
                </li>
                {types.length > 0 ? (
                    types.map((type) => (
                        <li key={type}>
                            <div
                                className={`type-item ${selected === type ? "selected" : ""}`}
                                onClick={() => {
                                    setSelected(type);
                                    setSelectedType(type);
                                }}
                            >
                                {type}
                            </div>
                        </li>
                    ))
                ) : (
                    <li>No types available</li>
                )}
            </ul>
        </div>
    );
};

export default TypeFilter;
