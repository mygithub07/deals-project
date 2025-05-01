import React, { useState, useEffect } from "react";
import { fetchDeals } from "./api";

const Cards = ({ selectedCategory }) => {
    const [deals, setDeals] = useState([]);
    const [filteredDeals, setFilteredDeals] = useState([]);
    const [visibleCount, setVisibleCount] = useState(9);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getDeals = async () => {
            try {
                setLoading(true);
                const response = await fetchDeals();
                setDeals(response);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch deals");
                setLoading(false);
            }
        };
        getDeals();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            setFilteredDeals(
                deals.filter((deal) => {
                    if (selectedCategory.type === "category") {
                        return deal.main_categories?.toLowerCase().includes(selectedCategory.name.toLowerCase());
                    } else if (selectedCategory.type === "subcategory") {
                        return deal.subcategories?.toLowerCase().includes(selectedCategory.name.toLowerCase());
                    }
                    return true;
                })
            );
        } else {
            setFilteredDeals(deals);
        }
    }, [selectedCategory, deals]);

    return (
        <div className="container">
            <div className="card-row">
                {loading ? (
                    <p>Loading deals...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : filteredDeals.length > 0 ? (
                    filteredDeals.slice(0, visibleCount).map((deal, index) => (
                        <div key={index} className="col-12 col-sm-6 col-lg-4">
                            <div className="card shadow-sm position-relative overflow-hidden">
                                <div className="overlay text-white">
                                    <div>
                                        <p className="fw-bold">{deal.title}</p>
                                    </div>
                                    <a href={deal.smartlink} target="_blank" rel="noopener noreferrer" className="btn btn-light">
                                        View Deal
                                    </a>
                                </div>
                                <div className="image-container">
                                    <img src={`data:image/jpeg;base64,${deal.image_data}`} alt={deal.title} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">No deals found for this category.</p>
                )}

                <div className="load-more-container text-center my-4">
                    {visibleCount < filteredDeals.length ? (
                        <button className="btn btn-primary" onClick={() => setVisibleCount((prev) => prev + 9)}>
                            Load More
                        </button>
                    ) : (
                        <p className="text-muted">No more items to load</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cards;
