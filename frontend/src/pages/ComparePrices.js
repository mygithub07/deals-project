import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Mock API response data
export const mockData = [
    { retailer: "Store A", price: "$15.99", productLink: "https://www.storea.com/product", description: "Great product from Store A" },
    { retailer: "Store B", price: "$14.50", productLink: "https://www.storeb.com/product", description: "Store B offers this at a discount." },
    { retailer: "Store C", price: "$16.20", productLink: "https://www.storec.com/product", description: "Store C has this with a special offer." },
];

export const ComparePrices = (props) => {
 
    console.log("prop from renderTopMenu:::", props.reRenderstate);
    const [rerender, setRerender] = useState('');
   
    const [comparisonData, setComparisonData] = useState([]);

    useEffect(() => {
        setRerender(props.reRenderstate);
        console.log("ComparePrices Mounted!");
        setComparisonData(mockData); // Simulate API call
    }, [props.reRenderstate]); // Re-run when state changes (ensures fresh re-render)

    return (
        <div className="compare-container">
            <h1>Compare Prices</h1>
            <p>Real-time price comparison will be displayed here.</p>
            <table className="comparison-table">
                <thead>
                    <tr>
                        <th>Retailer</th>
                        <th>Price</th>
                        <th>Product Info</th>
                        <th>Buy Now</th>
                    </tr>
                </thead>
                <tbody>
                    {comparisonData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.retailer}</td>
                            <td>{item.price}</td>
                            <td>{item.description}</td>
                            <td>
                                <a href={item.productLink} target="_blank" rel="noopener noreferrer">Buy Now</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


//export default ComparePrices;
