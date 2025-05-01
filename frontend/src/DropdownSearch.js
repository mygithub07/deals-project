import React, { useState, useEffect } from "react";

const DropdownSearch = () => {
    const [menu1, setMenu1] = useState([]);
    const [selectedMenu1, setSelectedMenu1] = useState("");
    const [input2, setInput2] = useState("");
    const [input3, setInput3] = useState("");
    const [searchResult, setSearchResult] = useState(null);

    // Mock API data
    useEffect(() => {
        setMenu1([{ id: 1, name: "Food" }, { id: 2, name: "Option 2" }]);
    }, []);


    const handleSearch = (e) => {
        e.preventDefault(); // Prevent form submission refresh

        // Ensure selectedMenu1 is the name, not the id
        const selectedMenuName = menu1.find(item => item.id === parseInt(selectedMenu1))?.name;

        console.log("Selected Menu Name: ", selectedMenuName); // Log the menu name

        if (selectedMenuName && input2.trim() !== "" && input3.trim() !== "") {
            fetch(
                `/wordpress2/wp-json/custom/v1/search?menu1=${encodeURIComponent(selectedMenuName)}&input2=${encodeURIComponent(input2)}&input3=${encodeURIComponent(input3)}`
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.length > 0) {
                        setSearchResult(data);
                    } else {
                        setSearchResult([{ message: "No results found." }]);
                    }
                })
                .catch((error) => console.error("Error performing search:", error));
        } else {
            alert("Please select a dropdown value and fill both input fields before searching.");
        }
    };


    return (
        <form
            onSubmit={handleSearch}
            style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}
        >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {/* First Dropdown */}
                <select
                    onChange={(e) => setSelectedMenu1(e.target.value)}
                    value={selectedMenu1}
                >
                    <option value="">Select Menu 1</option>
                    {menu1.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                {/* Second Input Field */}
                <input
                    type="text"
                    placeholder="Enter value for input 2"
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                    style={{ pointerEvents: "auto", backgroundColor: "white" }}
                />

                {/* Third Input Field */}
                <input
                    type="text"
                    placeholder="Enter value for input 3"
                    value={input3}
                    onChange={(e) => setInput3(e.target.value)}
                    style={{ pointerEvents: "auto", backgroundColor: "white" }}
                />

                {/* Search Button */}
                <button type="submit" disabled={!selectedMenu1 || !input2.trim() || !input3.trim()}>
                    Search
                </button>
            </div>

            {/* Display Search Results */}
            {searchResult && (
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <h3>Search Results:</h3>
                    {searchResult.length > 0 ? (
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                            {searchResult.map((item, index) => (
                                <li key={index} style={{ padding: "5px", borderBottom: "1px solid #ccc" }}>
                                    {Object.entries(item).map(([key, value]) => (
                                        <div key={key}><strong>{key}:</strong> {value}</div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No results found.</p>
                    )}
                </div>
            )}
        </form>
    );

};

export default DropdownSearch;
