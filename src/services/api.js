import { supabase } from '../supabaseClient';

/**
 * Backend Service Layer (Stratos API)
 * Centralizes all Supabase interactions to manage "backend routes" efficiently.
 */

const handleResponse = async (promise) => {
    try {
        const { data, error } = await promise;
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('API Error:', error.message || error);
        throw error;
    }
};

// --- PRODUCTS ---
export const getActiveProducts = () => 
    handleResponse(supabase.from('products').select('*').eq('status', 'active'));

export const getAllProducts = () => 
    handleResponse(supabase.from('products').select('*'));

export const createProduct = (productData) => 
    handleResponse(supabase.from('products').insert([productData]).select().single());

export const deleteProduct = (id) => 
    handleResponse(supabase.from('products').delete().eq('id', id));

// --- ORDERS ---
export const createOrder = (orderData) => 
    handleResponse(supabase.from('orders').insert([orderData]).select().single());

export const getOrders = () => 
    handleResponse(supabase.from('orders').select('*').order('created_at', { ascending: false }));

export const getOrderStats = () => 
    handleResponse(supabase.from('orders').select('total'));

// --- CONTACTS ---
export const createContact = (contactData) => 
    handleResponse(supabase.from('contacts').insert([contactData]).select().single());

export const getContacts = () => 
    handleResponse(supabase.from('contacts').select('*').order('created_at', { ascending: false }));

// --- SETTINGS ---
export const getSettings = async () => {
    const data = await handleResponse(supabase.from('settings').select('*'));

    // Convert array of {key, value} to a flat object
    const settingsMap = {};
    data.forEach(s => settingsMap[s.key] = s.value);
    return settingsMap;
};

export const updateSetting = (key, value) => 
    handleResponse(supabase.from('settings').upsert({ key, value, updated_at: new Date() }));

export const updateSettingsBatch = async (settingsObj) => {
    const promises = Object.entries(settingsObj).map(([key, value]) => 
        updateSetting(key, value)
    );
    await Promise.all(promises);
};
