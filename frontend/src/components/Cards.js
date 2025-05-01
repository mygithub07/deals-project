import React, { useState, useEffect } from "react";
import { fetchDeals } from "./api";

const Cards = ({ selectedCategory, selectedStore, selectedType }) => {
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
        if (selectedCategory || selectedStore) {
            setFilteredDeals(
                deals.filter((deal) => {
                    // If "All Deals" is selected, do not filter by category
                    const categoryMatch =
                        !selectedCategory || selectedCategory.name === "All Deals"
                            ? true
                            : selectedCategory.type === "category"
                                ? deal.main_categories?.toLowerCase().includes(selectedCategory.name.toLowerCase())
                                : selectedCategory.type === "subcategory"
                                    ? deal.subcategories?.toLowerCase().includes(selectedCategory.name.toLowerCase())
                                    : true;

                    // If "All Stores" is selected, do not filter by store
                    const storeMatch =
                        !selectedStore || selectedStore.name === "All Stores"
                            ? true
                            : deal.store?.toLowerCase() === selectedStore.name.toLowerCase();
                    const typeMatch =
                        !selectedType || selectedType === "All Types"
                            ? true
                            : deal.type?.toLowerCase() === selectedType.toLowerCase();
                    return categoryMatch && storeMatch && typeMatch;
                })
            );
        } else {
            setFilteredDeals(deals);
        }
    }, [selectedCategory, selectedStore, selectedType,deals]);



    return (
        <div className="container">
            <div className="card-row">
                {loading ? (
                    <p>Loading deals...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : filteredDeals.length > 0 ? (
                    <>
                        {filteredDeals.slice(0, visibleCount).map((deal, index) => (
                            <div key={index} className="col-12 col-sm-6 col-lg-4">
                                <div className="card shadow-sm position-relative overflow-hidden">
                                    <div className="overlay text-white d-flex flex-column justify-content-center align-items-center">
                                        <div>
                                            <p className="fw-bold">{deal.title}</p>
                                        
                                        </div>
                                        <a href={deal.smartlink} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-lg">
                                            View Deal on {deal.store}
                                        </a>
                                    </div>
                                    <div className="image-container">
                                        <img src={`data:image/jpeg;base64,${deal.image_data}`} alt={deal.title} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {visibleCount < filteredDeals.length && (
                            <div className="text-center mt-3">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setVisibleCount((prev) => prev + 9)}
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-muted">No deals found for the selected filters.</p>
                )}
            </div>
        </div>
    );
};

export default Cards;
