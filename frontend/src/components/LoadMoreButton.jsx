import React from "react";

const LoadMoreButton = ({ filteredDeals, visibleCount, setVisibleCount }) => {
    if (visibleCount >= filteredDeals.length) return null;

    return (
        <div className="text-center mt-4">
            <button
                onClick={() => setVisibleCount((prev) => prev + 9)}
                className="!bg-blue-800 text-white px-6 py-2 rounded-md hover:!bg-blue-600 transition-colors duration-200"
            >
                Load More
            </button>
        </div>
    );
};

export default LoadMoreButton;
