import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { SmartShopping } from "./components/SmartShopping";
import { Footer } from "./components/Footer";
import { RenderComparePrices } from "./RenderComparePrices";
import Sidebar from "./components/Sidebar";
import StoreFilter from "./components/StoreFilter";
import { fetchCategories, fetchStores, fetchTypes } from "./components/api";
import Cards from "./components/Cards";
import TypeFilter from "./components/TypeFilter";

export const AppRouter = () => {
    const location = useLocation();
    const [categories, setCategories] = useState({});
    const [stores, setStores] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({ type: null, name: null });
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    useEffect(() => {
        fetchCategories().then((data) => {
            if (typeof data === "object" && data !== null) setCategories(data);
            else setCategories({});
        });

        fetchStores().then((data) => {
            if (Array.isArray(data)) setStores(data);
            else setStores([]);
        });

        fetchTypes().then((data) => {
            if (Array.isArray(data)) setTypes(data);
            else setTypes([]);
        });
    }, []);

    return (
    <div className="container mx-auto px-0">
        <div className="flex flex-col h-screen w-full mb-4 mt-4">
            {/* Header */}
            <header className="max-w-none h-16 bg-white shadow-md z-10 flex items-center px-0 w-full">
                <Header />
            </header>

            {/* Content with Sidebar and Main */}
            <div className="flex flex-1 overflow-hidden w-full">
                {/* Sidebar only on /deals */}
                {location.pathname === "/deals" ? (
                    <aside className="w-72 bg-gray-100 border-r p-6 overflow-y-auto hidden lg:block">
                        <Sidebar data={categories} setSelectedCategory={setSelectedCategory} />
                        <StoreFilter stores={stores} setSelectedStore={setSelectedStore} />
                        <TypeFilter types={types} setSelectedType={setSelectedType} />
                    </aside>
                ) : null}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 w-full">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <HeroSection />
                                    <SmartShopping />
                                </>
                            }
                        />
                        <Route path="/compare-prices" element={<RenderComparePrices />} />
                        <Route
                            path="/deals"
                            element={
                                <Cards
                                    selectedCategory={selectedCategory}
                                    selectedStore={selectedStore}
                                    selectedType={selectedType}
                                />
                            }
                        />
                    </Routes>
                </main>
            </div>

            {/* Footer */}
            <footer className="h-14 bg-white border-t flex items-center justify-center text-sm w-full px-0">
                <Footer />
            </footer>
        </div>
    </div>
    );
};
