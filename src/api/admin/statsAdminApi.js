// src/api/admin/statsAdminApi.js
import { API_BASE_URL, ENDPOINTS } from '../../utils/constants';
import { getToken } from '../../utils/tokenUtils';

/**
 * Get auth headers
 */
const getAuthHeaders = () => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

/**
 * Transform stat item
 */
const transformStatItem = (item) => ({
    ...item,
    id: item._id || item.id,
});

/**
 * Fetch all stats (Admin)
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.STATS.LIST}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            const transformedData = [...data]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map(transformStatItem);
            return { success: true, data: transformedData };
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
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: transformStatItem(data) };
    } catch (error) {
        console.error('Error fetching stat by ID:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create new stat
 * @param {object} statData - Stat data { icon, color, number, label, order }
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const createStat = async (statData) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.STATS.CREATE}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                icon: statData.icon || '📊',
                color: statData.color || '#22C55E',
                number: parseInt(statData.number) || 0,
                label: statData.label || '',
                order: parseInt(statData.order) || 0,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: transformStatItem(data) };
    } catch (error) {
        console.error('Error creating stat:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update stat
 * @param {string} id - Stat ID
 * @param {object} statData - Stat data to update
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updateStat = async (id, statData) => {
    try {
        const updateData = {};

        if (statData.icon !== undefined) updateData.icon = statData.icon;
        if (statData.color !== undefined) updateData.color = statData.color;
        if (statData.number !== undefined) updateData.number = parseInt(statData.number);
        if (statData.label !== undefined) updateData.label = statData.label;
        if (statData.order !== undefined) updateData.order = parseInt(statData.order);

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.STATS.UPDATE(id)}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: transformStatItem(data) };
    } catch (error) {
        console.error('Error updating stat:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete stat
 * @param {string} id - Stat ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteStat = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.STATS.DELETE(id)}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting stat:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete all stats (bulk delete)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteAllStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.STATS.RESET}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting all stats:', error);
        return { success: false, error: error.message };
    }
};

export default {
    getAll: getStats,
    getById: getStatById,
    create: createStat,
    update: updateStat,
    delete: deleteStat,
    deleteAll: deleteAllStats,
};