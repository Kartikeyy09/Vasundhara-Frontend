// src/api/public/statsApi.js
import { API_BASE_URL, ENDPOINTS } from '../../utils/constants';

/**
 * Fetch all stats
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.STATS.LIST}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            const sortedData = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
            return { success: true, data: sortedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch single stat by ID
 * @param {string} id - Stat ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getStatById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.STATS.DETAIL(id)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching stat:', error);
        return { success: false, error: error.message };
    }
};

export default {
    getAll: getStats,
    getById: getStatById,
};