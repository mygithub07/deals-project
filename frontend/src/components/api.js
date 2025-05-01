const API_BASE_URL = "http://localhost:5001"; // Flask server URL

export const fetchDeals = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/deals`);  
        if (!response.ok) throw new Error("Failed to fetch deals");
        return await response.json();
    } catch (error) {
        console.error("Error fetching deals:", error);
        return [];
    }
};

export const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);  
        if (!response.ok) throw new Error("Failed to fetch categories");
        return await response.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return {};
    }
};

export const fetchStores = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/stores`);
        if (!response.ok) throw new Error("Failed to fetch stores");
        return await response.json();
    } catch (error) {
        console.error("Error fetching stores:", error);
        return [];
    }
};

export const fetchTypes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/types`);
        if (!response.ok) throw new Error("Failed to fetch stores");
        return await response.json();
    } catch (error) {
        console.error("Error fetching stores:", error);
        return [];
    }
};

