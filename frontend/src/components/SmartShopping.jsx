import React from "react";

export const SmartShopping = () => {
    return (
        <section className="w-full bg-white py-10 px-6 border-t">
            <h2 className="text-2xl font-semibold mb-2">Save More with Smart Shopping</h2>
            <p className="mb-4 text-gray-700">Track your favorite products & get price drop alerts!</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Create a Shopping List
                </button>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    Set Price Alerts
                </button>
            </div>
        </section>
    );
};
