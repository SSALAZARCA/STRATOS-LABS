const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Backend Service Layer (Stratos API)
 * Centralizes all Supabase interactions to manage "backend routes" efficiently.
 */

const handleResponse = async (responsePromise) => {
    const response = await responsePromise;
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error en la petición API');
    }
    return response.json();
};

// --- PRODUCTS ---
export const getActiveProducts = () => 
    handleResponse(fetch(`${API_URL}/products/active`));

export const getAllProducts = () => 
    handleResponse(fetch(`${API_URL}/products`));

export const createProduct = (productData) => 
    handleResponse(fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    }));

export const deleteProduct = (id) => 
    handleResponse(fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
    }));

// --- ORDERS ---
export const createOrder = (orderData) => 
    handleResponse(fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    }));

export const getOrders = () => 
    handleResponse(fetch(`${API_URL}/orders`));

export const getOrderStats = () => 
    handleResponse(fetch(`${API_URL}/orders/stats`));

// --- CONTACTS ---
export const createContact = (contactData) => 
    handleResponse(fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
    }));

export const getContacts = () => 
    handleResponse(fetch(`${API_URL}/contacts`));

// --- SETTINGS ---
export const getSettings = () => 
    handleResponse(fetch(`${API_URL}/settings`));

export const updateSetting = (key, value) => 
    handleResponse(fetch(`${API_URL}/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
    }));

export const updateSettingsBatch = async (settingsObj) => {
    const promises = Object.entries(settingsObj).map(([key, value]) => 
        updateSetting(key, value)
    );
    await Promise.all(promises);
};
