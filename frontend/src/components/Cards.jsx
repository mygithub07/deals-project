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
        <div className="container">
            <div className="card-row">
                {loading ? (
                    <p>Loading deals...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : filteredDeals.length > 0 ? (
                    <>
                        {filteredDeals.slice(0, visibleCount).map((deal, index) => (
                            <div key={index} className="p-4">
                                <Card className="w-full max-w-[400px] mx-auto">
                                    <CardHeader color="blue-gray" className="relative h-56">
                                        <img
                                            src={`data:image/jpeg;base64,${deal.image_data}`}
                                            alt={deal.title}
                                            className="object-cover w-full h-full"
                                        />
                                    </CardHeader>
                                    <CardBody>
                                        <Typography variant="h6" color="blue-gray" className="mb-2">
                                            {deal.title}
                                        </Typography>
                                        <Typography className="text-sm">
                                            {deal.description?.slice(0, 100) || "No description available."}
                                        </Typography>
                                    </CardBody>
                                    <CardFooter className="pt-0">
                                        <a
                                            href={deal.smartlink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block"
                                        >
                                            <Button fullWidth color="blue">
                                                View Deal on {deal.store}
                                            </Button>
                                        </a>
                                    </CardFooter>
                                </Card>
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
