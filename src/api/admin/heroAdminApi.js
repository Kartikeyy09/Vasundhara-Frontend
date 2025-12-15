// src/api/admin/heroAdminApi.js
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
 * Transform hero item
 */
const transformHeroItem = (item) => ({
    ...item,
    id: item._id || item.id,
    computedImageUrl: getImageUrl(item.imageUrl, item.useUpload),
});

/**
 * Fetch all hero slides (Admin)
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getHeroSlides = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.HERO.LIST}`, {
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
                .map(transformHeroItem);
            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch single hero slide by ID
 * @param {string} id - Slide ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getHeroById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.HERO.DETAIL(id)}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: transformHeroItem(data) };
    } catch (error) {
        console.error('Error fetching hero by ID:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create new hero slide
 * @param {object} heroData - Hero data
 * @param {File} imageFile - Optional image file
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const createHero = async (heroData, imageFile = null) => {
    try {
        let body;
        let headers;

        if (imageFile) {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('title', heroData.title || '');
            formData.append('subtitle', heroData.subtitle || '');
            formData.append('autoplay', heroData.autoplay || false);
            formData.append('duration', heroData.duration || 5);
            formData.append('order', heroData.order || 0);
            formData.append('useUpload', 'true');

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            // Use JSON for URL-based image
            body = JSON.stringify({
                ...heroData,
                useUpload: false,
            });
            headers = getAuthHeaders(false);
        }

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.HERO.CREATE}`, {
            method: 'POST',
            headers,
            body,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: transformHeroItem(data) };
    } catch (error) {
        console.error('Error creating hero:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update hero slide
 * @param {string} id - Hero ID
 * @param {object} heroData - Hero data to update
 * @param {File} imageFile - Optional new image file
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updateHero = async (id, heroData, imageFile = null) => {
    try {
        let body;
        let headers;

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);

            if (heroData.title !== undefined) formData.append('title', heroData.title);
            if (heroData.subtitle !== undefined) formData.append('subtitle', heroData.subtitle);
            if (heroData.autoplay !== undefined) formData.append('autoplay', heroData.autoplay);
            if (heroData.duration !== undefined) formData.append('duration', heroData.duration);
            if (heroData.order !== undefined) formData.append('order', heroData.order);
            formData.append('useUpload', 'true');

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            body = JSON.stringify(heroData);
            headers = getAuthHeaders(false);
        }

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.HERO.UPDATE(id)}`, {
            method: 'PUT',
            headers,
            body,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: transformHeroItem(data) };
    } catch (error) {
        console.error('Error updating hero:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete hero slide
 * @param {string} id - Hero ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteHero = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.HERO.DELETE(id)}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting hero:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete all hero slides (bulk delete)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteAllHeroes = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.HERO.RESET}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting all heroes:', error);
        return { success: false, error: error.message };
    }
};

export default {
    getAll: getHeroSlides,
    getById: getHeroById,
    create: createHero,
    update: updateHero,
    delete: deleteHero,
    deleteAll: deleteAllHeroes,
};