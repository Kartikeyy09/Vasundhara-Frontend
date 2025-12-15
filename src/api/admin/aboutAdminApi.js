// src/api/admin/aboutAdminApi.js
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
        const ASSET_BASE_URL = API_BASE_URL.replace(/\/api$/, '');
        return `${ASSET_BASE_URL}${imageUrl}`;
    }

    if (useUpload) {
        return IMAGES.url(imageUrl);
    }

    return imageUrl;
};

/**
 * Transform about item
 */
const transformAboutItem = (item) => ({
    ...item,
    id: item._id || item.id,
    computedImageUrl: getImageUrl(item.mainImage, item.useUpload),
});

/**
 * Fetch all about items (Admin)
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getAboutItems = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.ABOUT.LIST}`, {
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
                .map(transformAboutItem);
            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching about items:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch single about item by ID
 * @param {string} id - About ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getAboutById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.ABOUT.DETAIL(id)}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: transformAboutItem(data) };
    } catch (error) {
        console.error('Error fetching about by ID:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create new about item
 * @param {object} aboutData - About data
 * @param {File} imageFile - Optional image file
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const createAbout = async (aboutData, imageFile = null) => {
    try {
        let body;
        let headers;

        if (imageFile) {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('mainImage', imageFile);
            formData.append('title', aboutData.title || '');
            formData.append('description', aboutData.description || '');
            formData.append('order', aboutData.order || 0);
            formData.append('useUpload', 'true');

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            // Use JSON for URL-based image
            body = JSON.stringify({
                ...aboutData,
                useUpload: false,
            });
            headers = getAuthHeaders(false);
        }

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.ABOUT.CREATE}`, {
            method: 'POST',
            headers,
            body,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Handle both { item: ... } and direct response
        const item = data.item || data;
        return { success: true, data: transformAboutItem(item) };
    } catch (error) {
        console.error('Error creating about:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update about item
 * @param {string} id - About ID
 * @param {object} aboutData - About data to update
 * @param {File} imageFile - Optional new image file
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updateAbout = async (id, aboutData, imageFile = null) => {
    try {
        let body;
        let headers;

        if (imageFile) {
            const formData = new FormData();
            formData.append('mainImage', imageFile);

            if (aboutData.title !== undefined) formData.append('title', aboutData.title);
            if (aboutData.description !== undefined) formData.append('description', aboutData.description);
            if (aboutData.order !== undefined) formData.append('order', aboutData.order);
            formData.append('useUpload', 'true');

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            body = JSON.stringify(aboutData);
            headers = getAuthHeaders(false);
        }

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.ABOUT.UPDATE(id)}`, {
            method: 'PUT',
            headers,
            body,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const item = data.item || data;
        return { success: true, data: transformAboutItem(item) };
    } catch (error) {
        console.error('Error updating about:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete about item
 * @param {string} id - About ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteAbout = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.ABOUT.DELETE(id)}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting about:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete all about items (bulk delete)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteAllAbouts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.ABOUT.RESET}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting all abouts:', error);
        return { success: false, error: error.message };
    }
};

export default {
    getAll: getAboutItems,
    getById: getAboutById,
    create: createAbout,
    update: updateAbout,
    delete: deleteAbout,
    deleteAll: deleteAllAbouts,
};