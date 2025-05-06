import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
//import { FeaturedDeals } from "./components/FeaturedDeals";
import { SmartShopping } from "./components/SmartShopping";
import { Footer } from "./components/Footer";
import { RenderComparePrices } from "./RenderComparePrices";
import Sidebar from "./components/Sidebar";
import StoreFilter from "./components/StoreFilter"; // New Component
import { fetchCategories, fetchStores, fetchTypes} from "./components/api"; // Import fetchStores function
import Cards from "./components/Cards";
import TypeFilter from "./components/TypeFilter";

export const AppRouter = () => {
    const location = useLocation();
    const [categories, setCategories] = useState({});
    const [stores, setStores] = useState([]); // New State for Stores
    const [types, setTypes] = useState([]);
    const [sidebarContainer, setSidebarContainer] = useState(null);
    const [storeFilterContainer, setStoreFilterContainer] = useState(null); // New state for StoreFilter
    const [selectedCategory, setSelectedCategory] = useState({ type: null, name: null });
    const [selectedStore, setSelectedStore] = useState(null); // Store selection state
    const [selectedType, setSelectedType] = useState(null);

    useEffect(() => {
        fetchCategories().then((data) => {
            if (typeof data === "object" && data !== null) {
                setCategories(data);
            } else {
                console.error("Invalid category format:", data);
                setCategories({});
            }
        });

        fetchStores().then((storeData) => {
            if (Array.isArray(storeData)) {
                setStores(storeData);
            } else {
                console.error("Invalid store format:", storeData);
                setStores([]);
            }
        });
        fetchTypes().then((typeData) => {  // Fetch Types
            if (Array.isArray(typeData)) {
                setTypes(typeData);
            } else {
                console.error("Invalid type format:", typeData);
                setTypes([]);
            }
        });

    }, []);

    

    useEffect(() => {
        if (location.pathname === "/deals") {
            const container = document.querySelector(".container");
            if (container) {
                // Sidebar Element
                let sidebarDiv = document.getElementById("side-menu");
                if (!sidebarDiv) {
                    sidebarDiv = document.createElement("div");
                    sidebarDiv.className = "sidebar";
                    sidebarDiv.id = "side-menu";
                    container.appendChild(sidebarDiv);
                }
                setSidebarContainer(sidebarDiv);

                // Store Filter Element (Separate from Sidebar)
                // let storeFilterDiv = document.getElementById("store-filter");
                // if (!storeFilterDiv) {
                //     storeFilterDiv = document.createElement("div");
                //     storeFilterDiv.className = "store-filter";
                //     storeFilterDiv.id = "store-filter";
                //     container.appendChild(storeFilterDiv);
                // }
                // setStoreFilterContainer(storeFilterDiv);
            } else {
                setSidebarContainer(null);
               // setStoreFilterContainer(null);
            }
        }
    }, [location.pathname]);

    console.log("Categories in AppRouter:", categories);
    console.log("Stores in AppRouter:", stores);
    console.log("Selected Category:", selectedCategory);
    console.log("Selected Store:", selectedStore);

    return (
        <div className="app-wrapper">
            <Header />
            <div className="content-wrapper">
                <div className="page-container">
                    <main className="main-content">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <div className="hero-container">
                                            <HeroSection />
                                        </div>
                                        {/* <FeaturedDeals /> */}
                                        <SmartShopping />
                                    </>
                                }
                            />
                            <Route path="/compare-prices" element={<RenderComparePrices />} />
                            <Route
                                path="/deals"
                                element={
                                    <>
                                        {sidebarContainer &&
                                            createPortal(
                                                <Sidebar data={categories} setSelectedCategory={setSelectedCategory} />,
                                                sidebarContainer
                                            )}
                        
                                        {sidebarContainer &&
                                            createPortal(
                                                <StoreFilter stores={stores} setSelectedStore={setSelectedStore} />,
                                                sidebarContainer
                                            )}

                                        {sidebarContainer &&
                                            createPortal(
                                                <TypeFilter types={types} setSelectedType={setSelectedType} />, // FIXED PROP
                                                sidebarContainer
                                            )}
                                        <Cards selectedCategory={selectedCategory} selectedStore={selectedStore} selectedType={selectedType}/>
                                    </>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};
