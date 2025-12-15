// src/api/public/aboutUsApi.js
import { API_BASE_URL, ENDPOINTS, IMAGES } from '../../utils/constants';

/**
 * Get proper image URL
 * @param {string} imageUrl - Image URL or filename
 * @param {boolean} useUpload - Whether image is uploaded to server
 * @returns {string} - Complete image URL
 */
const getImageUrl = (imageUrl, useUpload = false) => {
    if (!imageUrl) return '';

    // If already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    // If it starts with /uploads, prepend the asset base URL
    if (imageUrl.startsWith('/uploads')) {
        const ASSET_BASE_URL = API_BASE_URL.replace(/\/api$/, '');
        return `${ASSET_BASE_URL}${imageUrl}`;
    }

    // If useUpload is true, construct URL using IMAGES helper
    if (useUpload) {
        return IMAGES.url(imageUrl);
    }

    return imageUrl;
};

/**
 * Fetch About Us hero images
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getAboutUsHero = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.HERO.LIST}`, {
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
            const transformedData = [...data]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map(item => ({
                    ...item,
                    computedImageUrl: getImageUrl(item.image || item.imageUrl, item.useUpload),
                }));

            return { success: true, data: transformedData };
        }

        if (data && typeof data === 'object') {
            return {
                success: true,
                data: [{
                    ...data,
                    computedImageUrl: getImageUrl(data.image || data.imageUrl, data.useUpload),
                }],
            };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching about us hero:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch About Us about section (singleton)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getAboutUsAbout = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.ABOUT.GET}`, {
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

        return {
            success: true,
            data: {
                ...data,
                computedImageUrl: getImageUrl(data.image || data.imageUrl, data.useUpload),
            },
        };
    } catch (error) {
        console.error('Error fetching about us about:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch all areas we work
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getAboutUsAreas = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.AREAS.LIST}`, {
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
            const transformedData = [...data]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map(item => ({
                    ...item,
                    computedImageUrl: getImageUrl(item.image || item.imageUrl, item.useUpload),
                }));

            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching about us areas:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch single area by ID
 * @param {string} id - Area ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getAboutUsAreaById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ABOUT_US_ROUTES.AREAS.DETAIL(id)}`, {
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

        return {
            success: true,
            data: {
                ...data,
                computedImageUrl: getImageUrl(data.image || data.imageUrl, data.useUpload),
            },
        };
    } catch (error) {
        console.error('Error fetching about us area:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch all About Us page data at once
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getAboutUsPageData = async () => {
    try {
        const [heroResult, aboutResult, areasResult] = await Promise.all([
            getAboutUsHero(),
            getAboutUsAbout(),
            getAboutUsAreas(),
        ]);

        return {
            success: true,
            data: {
                hero: heroResult.success ? heroResult.data : [],
                about: aboutResult.success ? aboutResult.data : null,
                areas: areasResult.success ? areasResult.data : [],
            },
        };
    } catch (error) {
        console.error('Error fetching about us page data:', error);
        return { success: false, error: error.message };
    }
};

export default {
    getHero: getAboutUsHero,
    getAbout: getAboutUsAbout,
    getAreas: getAboutUsAreas,
    getAreaById: getAboutUsAreaById,
    getPageData: getAboutUsPageData,
};