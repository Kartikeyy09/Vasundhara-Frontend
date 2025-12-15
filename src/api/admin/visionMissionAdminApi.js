// src/api/admin/visionMissionAdminApi.js
import { API_BASE_URL, ENDPOINTS, IMAGES } from '../../utils/constants';
import { getToken } from '../../utils/tokenUtils';

/**
 * Get auth headers
 */
const getAuthHeaders = (isFormData = false) => {
    const token = getToken();
    const headers = {};

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

/**
 * Get proper image URL
 */
const getImageUrl = (imageUrl, useUpload = false) => {
    if (!imageUrl) return '';

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    if (imageUrl.startsWith('/uploads')) {
        return IMAGES.url(imageUrl);
    }

    if (useUpload) {
        return IMAGES.url(imageUrl);
    }

    return imageUrl;
};

/**
 * Helper to convert File to base64 data URL (for previews)
 */
export const fileToDataURL = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

/* ========================================================================
   HERO SECTION API (Singleton - single hero section)
   ======================================================================== */

/**
 * Transform hero item
 */
const transformHeroItem = (item) => ({
    ...item,
    id: item._id || item.id,
    computedImageUrl: getImageUrl(item.imageUrl, item.useUpload),
});

/**
 * Get hero section (singleton)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getVmHero = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.HERO.GET}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: transformHeroItem(data) };
    } catch (error) {
        console.error('Error fetching VM hero:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Upsert hero section (create or update singleton)
 * @param {object} heroData - { title, description, imageUrl?, useUpload? }
 * @param {File|null} imageFile - optional image file
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const upsertVmHero = async (heroData, imageFile = null) => {
    try {
        let body;
        let headers;

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            if (heroData.title !== undefined) formData.append('title', heroData.title);
            if (heroData.description !== undefined) formData.append('description', heroData.description);
            formData.append('useUpload', 'true');

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            body = JSON.stringify({
                ...heroData,
                useUpload: heroData.useUpload ?? false,
            });
            headers = getAuthHeaders(false);
        }

        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.HERO.UPSERT}`,
            {
                method: 'POST',
                headers,
                body,
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const item = data.hero || data;
        return { success: true, data: transformHeroItem(item) };
    } catch (error) {
        console.error('Error upserting VM hero:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Reset hero section
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const resetVmHero = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.HERO.RESET}`,
            {
                method: 'DELETE',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error resetting VM hero:', error);
        return { success: false, error: error.message };
    }
};

/* ========================================================================
   VISION/MISSION ITEMS API (Multiple items with type filter)
   ======================================================================== */

/**
 * Transform VM item
 */
const transformVmItem = (item) => ({
    ...item,
    id: item._id || item.id,
    computedImageUrl: getImageUrl(item.imageUrl, item.useUpload),
});

/**
 * Get all VM items (optionally filter by type)
 * @param {string|null} type - optional filter (mission, vision, goal, values)
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getVmItems = async (type = null) => {
    try {
        let url = `${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.ITEMS.LIST}`;
        if (type) {
            url = `${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.ITEMS.BY_TYPE(type)}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            const transformedData = data
                .map(transformVmItem)
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching VM items:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get VM items by type
 * @param {string} type - mission, vision, goal, values
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getVmItemsByType = async (type) => {
    return getVmItems(type);
};

/**
 * Get VM item by ID
 * @param {string} id - item ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getVmItemById = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.ITEMS.DETAIL(id)}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: transformVmItem(data) };
    } catch (error) {
        console.error('Error fetching VM item by ID:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create VM item
 * @param {object} itemData - { type, title, description, imageUrl?, order? }
 * @param {File|null} imageFile - optional image file
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const createVmItem = async (itemData, imageFile = null) => {
    try {
        let body;
        let headers;

        if (!itemData.type || String(itemData.type).trim() === '') {
            throw new Error('Type is required (e.g., mission, vision, goal, values)');
        }

        if (!itemData.title || String(itemData.title).trim() === '') {
            throw new Error('Title is required');
        }

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('type', itemData.type.toLowerCase().trim());
            formData.append('title', itemData.title.trim());
            formData.append('description', itemData.description || '');
            formData.append('order', itemData.order || 0);
            formData.append('useUpload', 'true');

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            body = JSON.stringify({
                type: itemData.type.toLowerCase().trim(),
                title: itemData.title.trim(),
                description: itemData.description || '',
                imageUrl: itemData.imageUrl || '',
                useUpload: false,
                order: itemData.order || 0,
            });
            headers = getAuthHeaders(false);
        }

        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.ITEMS.CREATE}`,
            {
                method: 'POST',
                headers,
                body,
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const item = data.item || data;
        return { success: true, data: transformVmItem(item) };
    } catch (error) {
        console.error('Error creating VM item:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update VM item
 * @param {string} id - item ID
 * @param {object} itemData - { type?, title?, description?, imageUrl?, order? }
 * @param {File|null} imageFile - optional new image file
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updateVmItem = async (id, itemData, imageFile = null) => {
    try {
        let body;
        let headers;

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            if (itemData.type !== undefined) formData.append('type', itemData.type.toLowerCase().trim());
            if (itemData.title !== undefined) formData.append('title', itemData.title.trim());
            if (itemData.description !== undefined) formData.append('description', itemData.description);
            if (itemData.order !== undefined) formData.append('order', itemData.order);
            formData.append('useUpload', 'true');

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            const updateData = { ...itemData };
            if (updateData.type) updateData.type = updateData.type.toLowerCase().trim();
            if (updateData.title) updateData.title = updateData.title.trim();

            body = JSON.stringify(updateData);
            headers = getAuthHeaders(false);
        }

        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.ITEMS.UPDATE(id)}`,
            {
                method: 'PUT',
                headers,
                body,
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const item = data.item || data;
        return { success: true, data: transformVmItem(item) };
    } catch (error) {
        console.error('Error updating VM item:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete VM item
 * @param {string} id - item ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteVmItem = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.ITEMS.DELETE(id)}`,
            {
                method: 'DELETE',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting VM item:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete all VM items
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteAllVmItems = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.ITEMS.RESET}`,
            {
                method: 'DELETE',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting all VM items:', error);
        return { success: false, error: error.message };
    }
};

/* ========================================================================
   DEFAULT EXPORTS
   ======================================================================== */

export default {
    // Hero (Singleton)
    hero: {
        get: getVmHero,
        upsert: upsertVmHero,
        reset: resetVmHero,
    },
    // Items (Multiple with type filter)
    items: {
        getAll: getVmItems,
        getByType: getVmItemsByType,
        getById: getVmItemById,
        create: createVmItem,
        update: updateVmItem,
        delete: deleteVmItem,
        deleteAll: deleteAllVmItems,
    },
    // Utility
    fileToDataURL,
};