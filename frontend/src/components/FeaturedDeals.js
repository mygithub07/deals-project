import React, { useEffect, useState } from "react";
import axios from "axios";

export const FeaturedDeals = () => {
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        axios.get("/api/best-deals").then((response) => {
            setDeals(response.data);
        });
    }, []);

    return (
        <section className= "featured-deals" >
        <h2>Today's Best Deals</h2>
            < div className = "deals-grid" >
            {
                deals.map((deal, index) => (
                    <div key= { index } className = "deal-card" >
                    <img src={ deal.image } alt = { deal.name } />
                    <h3>{ deal.name } </h3>
                    < p > Lowest Price: ${ deal.price } </p>
                    < button > Compare Prices </button>
                </div>
                ))
            }
                </div>
                </section>
  );
};

//export default FeaturedDeals;
