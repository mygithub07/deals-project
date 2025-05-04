import React, { useState, useEffect } from "react";
import { fetchStores } from "./api";


const StoreFilter = ({ setSelectedStore }) => {
    const [stores, setStores] = useState([]);
    const [selected, setSelected] = useState("All");

    useEffect(() => {
        const getStores = async () => {
            try {
                const response = await fetchStores();
                if (Array.isArray(response)) {
                    setStores(response);
                } else {
                    console.error("Invalid store data format:", response);
                }
            } catch (error) {
                console.error("Error fetching stores:", error);
            }
        };
        getStores();
    }, []);

    return (
        <div className="store-menu">
            <h3 className="store-menu-title">Stores</h3>
            <ul className="store-menu-list">
                <li>
                    <div
                        className={`store-item ${selected === "All" ? "selected" : ""}`}
                        onClick={() => {
                            setSelected("All");
                            setSelectedStore({ type: "all", name: "All Stores" });
                        }}
                    >
                        All Stores
                    </div>
                </li>
                {stores.length > 0 ? (
                    stores.map((store) => (
                        <li key={store}>
                            <div
                                className={`store-item ${selected === store ? "selected" : ""}`}
                                onClick={() => {
                                    setSelected(store);
                                    setSelectedStore({ type: "store", name: store });
                                }}
                            >
                                {store}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="store-item no-stores">No stores available</li>
                )}
            </ul>
        </div>
    );
};

export default StoreFilter;
