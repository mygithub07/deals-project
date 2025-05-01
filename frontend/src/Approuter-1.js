import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeaturedDeals } from "./components/FeaturedDeals";
import { SmartShopping } from "./components/SmartShopping";
import { Footer } from "./components/Footer";
import { RenderComparePrices } from "./RenderComparePrices";
import Sidebar from "./components/Sidebar";
import { fetchCategories } from "./components/api"; // Import category fetch function
import Cards from "./components/Cards";


export const AppRouter = () => {
    const location = useLocation();
    const [categories, setCategories] = useState({});
    const [sidebarContainer, setSidebarContainer] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState({ type: null, name: null }); // ⬅️ Store type & name

    useEffect(() => {
        fetchCategories().then((data) => {
            if (typeof data === "object" && data !== null) {
                setCategories(data);
            } else {
                console.error("Invalid category format:", data);
                setCategories({});
            }
        });
    }, []);

    useEffect(() => {
        if (location.pathname === "/deals") {
            const container = document.querySelector(".container");
            if (container) {
                let sidebarDiv = document.getElementById("side-menu");
                if (!sidebarDiv) {
                    sidebarDiv = document.createElement("div");
                    sidebarDiv.className = "sidebar";
                    sidebarDiv.id = "side-menu";
                    container.appendChild(sidebarDiv);
                }
                setSidebarContainer(sidebarDiv);
            } else {
                setSidebarContainer(null);
            }
        }
    }, [location.pathname]);

    console.log("categories in AppRouter:", categories);
    console.log("selectedCategory in AppRouter:", selectedCategory);

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
                                        <FeaturedDeals />
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
                                                <Sidebar
                                                    data={categories}
                                                    setSelectedCategory={setSelectedCategory} // ✅ Pass object with type & name
                                                />,
                                                sidebarContainer
                                            )}
                                        <Cards selectedCategory={selectedCategory} /> {/* ✅ Pass selectedCategory */}
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
