import React, { useState, useEffect } from "react";
import { fetchDeals } from "./api";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";

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
        <div className=" min-h-screen flex flex-col px-2 sm:px-4 lg:px-6">
          <div className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-stretch">
                {loading ? (
                    <p>Loading deals...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : filteredDeals.length > 0 ? (
                    <>
                        {filteredDeals.slice(0, visibleCount).map((deal, index) => (
                            <div key={index} className="h-full flex">
                                <Card className="flex flex-col justify-between h-[380px] w-full max-w-xs mx-auto shadow-md">
                                    <CardHeader color="blue-gray" className="relative h-60">
                                        <img
                                            src={`data:image/jpeg;base64,${deal.image_data}`}
                                            alt={deal.title}
                                            className="object-cover w-full h-full"
                                        />
                                    </CardHeader>
                                    <CardBody  className="pt-1 pb-1 px-2">
                                        <Typography variant="h6" color="blue-gray" className="mb-2">
                                            {deal.title}
                                        </Typography>
                                        <Typography className="text-sm">
                                            {deal.offer_text?.slice(0, 100) || "No description available."}
                                        </Typography>
                                    </CardBody>
                                    <CardFooter className="px-3 pb-3 pt-2 mt-auto">
                                        <a
                                            href={deal.smartlink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full"
                                        >
                                            <button
                                                className="!bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md hover:!bg-blue-700 transition-colors duration-200"
                                                disabled={!deal.smartlink} // Optional safety
                                            >
                                                View Deal
                                            </button>
                                        </a>
                                    </CardFooter>

                                </Card>
                            </div>
                        ))}
                        
                    </>
                ) : (
                    <p className="text-muted">No deals found for the selected filters.</p>
                )}
            </div>
        </div>
            {visibleCount < filteredDeals.length && (
                <div className="col-span-full text-center mt-4">
                    <button
                        onClick={() => setVisibleCount((prev) => prev + 9)}
                        className="!bg-blue-600 text-white px-6 py-2 rounded-md hover:!bg-blue-700 transition-colors duration-200"
                    >
                        Load More
                    </button>
                </div>
            )}

        </div>
    );

 
};

export default Cards;
