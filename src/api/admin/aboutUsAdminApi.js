// src/api/admin/aboutUsAdminApi.js
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
   HERO SECTION API (Multiple images for slider)
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
 * Get all hero images
 */
export const getHeroImages = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.HERO.LIST}`,
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

        if (Array.isArray(data)) {
            const transformedData = data
                .map(transformHeroItem)
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching hero images:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get hero image by ID
 */
export const getHeroById = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.HERO.DETAIL(id)}`,
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
        console.error('Error fetching hero by ID:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create hero image
 */
export const createHero = async (heroData, imageFile = null) => {
    try {
        let body;
        let headers;

        if (!heroData.title || String(heroData.title).trim() === '') {
            throw new Error('Title is required');
        }

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('title', heroData.title || '');
            formData.append('order', heroData.order || 0);
            formData.append('useUpload', 'true');

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            if (!heroData.imageUrl || String(heroData.imageUrl).trim() === '') {
                throw new Error('Image URL is required when not uploading a file');
            }

            body = JSON.stringify({
                title: heroData.title,
                imageUrl: heroData.imageUrl,
                useUpload: false,
                order: heroData.order || 0,
            });
            headers = getAuthHeaders(false);
        }

        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.HERO.CREATE}`,
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
        return { success: true, data: transformHeroItem(item) };
    } catch (error) {
        console.error('Error creating hero:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update hero image
 */
export const updateHero = async (id, heroData, imageFile = null) => {
    try {
        let body;
        let headers;

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            if (heroData.title !== undefined) formData.append('title', heroData.title);
            if (heroData.order !== undefined) formData.append('order', heroData.order);
            formData.append('useUpload', 'true');

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            body = JSON.stringify(heroData);
            headers = getAuthHeaders(false);
        }

        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.HERO.UPDATE(id)}`,
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
        return { success: true, data: transformHeroItem(item) };
    } catch (error) {
        console.error('Error updating hero:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete hero image
 */
export const deleteHero = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.HERO.DELETE(id)}`,
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
        console.error('Error deleting hero:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete all hero images
 */
export const deleteAllHeroes = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.HERO.RESET}`,
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
        console.error('Error deleting all heroes:', error);
        return { success: false, error: error.message };
    }
};

/* ========================================================================
   ABOUT SECTION API (Singleton - single about section)
   ======================================================================== */

/**
 * Transform about item
 */
const transformAboutItem = (item) => ({
    ...item,
    id: item._id || item.id,
    computedImageUrl: getImageUrl(item.imageUrl, item.useUpload),
});

/**
 * Get about section (singleton)
 */
export const getAboutSection = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.ABOUT.GET}`,
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
        return { success: true, data: transformAboutItem(data) };
    } catch (error) {
        console.error('Error fetching about section:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Upsert about section (create or update singleton)
 */
export const upsertAboutSection = async (aboutData, imageFile = null) => {
    try {
        let body;
        let headers;

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            if (aboutData.title !== undefined) formData.append('title', aboutData.title);
            if (aboutData.description !== undefined) formData.append('description', aboutData.description);
            formData.append('useUpload', 'true');

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            body = JSON.stringify({
                ...aboutData,
                useUpload: aboutData.useUpload ?? false,
            });
            headers = getAuthHeaders(false);
        }

        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.ABOUT.UPSERT}`,
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
        const item = data.about || data;
        return { success: true, data: transformAboutItem(item) };
    } catch (error) {
        console.error('Error upserting about section:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Reset about section
 */
export const resetAboutSection = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.ABOUT.RESET}`,
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
        console.error('Error resetting about section:', error);
        return { success: false, error: error.message };
    }
};

/* ========================================================================
   AREAS WE WORK API (Multiple items)
   ======================================================================== */

/**
 * Transform area item
 */
const transformAreaItem = (item) => ({
    ...item,
    id: item._id || item.id,
    computedImageUrl: getImageUrl(item.imageUrl, item.useUpload),
});

/**
 * Get all areas
 */
export const getAreas = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.AREAS.LIST}`,
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

        if (Array.isArray(data)) {
            const transformedData = data
                .map(transformAreaItem)
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching areas:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get area by ID
 */
export const getAreaById = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.AREAS.DETAIL(id)}`,
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
        return { success: true, data: transformAreaItem(data) };
    } catch (error) {
        console.error('Error fetching area by ID:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create area
 */
export const createArea = async (areaData, imageFile = null) => {
    try {
        let body;
        let headers;

        if (!areaData.title || String(areaData.title).trim() === '') {
            throw new Error('Title is required');
        }

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('title', areaData.title || '');
            formData.append('description', areaData.description || '');
            formData.append('order', areaData.order || 0);
            formData.append('useUpload', 'true');

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            if (!areaData.imageUrl || String(areaData.imageUrl).trim() === '') {
                throw new Error('Image URL is required when not uploading a file');
            }

            body = JSON.stringify({
                title: areaData.title,
                description: areaData.description || '',
                imageUrl: areaData.imageUrl,
                useUpload: false,
                order: areaData.order || 0,
            });
            headers = getAuthHeaders(false);
        }

        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.AREAS.CREATE}`,
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
        return { success: true, data: transformAreaItem(item) };
    } catch (error) {
        console.error('Error creating area:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update area
 */
export const updateArea = async (id, areaData, imageFile = null) => {
    try {
        let body;
        let headers;

        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            if (areaData.title !== undefined) formData.append('title', areaData.title);
            if (areaData.description !== undefined) formData.append('description', areaData.description);
            if (areaData.order !== undefined) formData.append('order', areaData.order);
            formData.append('useUpload', 'true');

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            body = JSON.stringify(areaData);
            headers = getAuthHeaders(false);
        }

        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.AREAS.UPDATE(id)}`,
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
        return { success: true, data: transformAreaItem(item) };
    } catch (error) {
        console.error('Error updating area:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete area
 */
export const deleteArea = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.AREAS.DELETE(id)}`,
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
        console.error('Error deleting area:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete all areas
 */
export const deleteAllAreas = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.AREAS.RESET}`,
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
        console.error('Error deleting all areas:', error);
        return { success: false, error: error.message };
    }
};

/* ========================================================================
   DEFAULT EXPORTS
   ======================================================================== */

export default {
    // Hero
    hero: {
        getAll: getHeroImages,
        getById: getHeroById,
        create: createHero,
        update: updateHero,
        delete: deleteHero,
        deleteAll: deleteAllHeroes,
    },
    // About
    about: {
        get: getAboutSection,
        upsert: upsertAboutSection,
        reset: resetAboutSection,
    },
    // Areas
    areas: {
        getAll: getAreas,
        getById: getAreaById,
        create: createArea,
        update: updateArea,
        delete: deleteArea,
        deleteAll: deleteAllAreas,
    },
    // Utility
    fileToDataURL,
};