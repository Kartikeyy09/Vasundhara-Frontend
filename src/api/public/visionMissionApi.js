// src/api/public/visionMissionApi.js
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
 * Fetch Vision & Mission hero (singleton)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getVisionMissionHero = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.HERO.GET}`, {
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
                computedImageUrl: getImageUrl(data.imageUrl || data.image, data.useUpload),
            },
        };
    } catch (error) {
        console.error('Error fetching vision mission hero:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch all Vision & Mission items
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getVisionMissionItems = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.ITEMS.LIST}`, {
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
                    computedImageUrl: getImageUrl(item.imageUrl || item.image, item.useUpload),
                }));

            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching vision mission items:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch Vision & Mission items by type
 * @param {string} type - 'vision', 'mission', or 'goals'
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getVisionMissionByType = async (type) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.ITEMS.BY_TYPE(type)}`, {
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
                    computedImageUrl: getImageUrl(item.imageUrl || item.image, item.useUpload),
                }));

            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching vision mission by type:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch single item by ID
 * @param {string} id - Item ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getVisionMissionItemById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.VISION_MISSION_ROUTES.ITEMS.DETAIL(id)}`, {
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
                computedImageUrl: getImageUrl(data.imageUrl || data.image, data.useUpload),
            },
        };
    } catch (error) {
        console.error('Error fetching vision mission item:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch all Vision & Mission page data with items grouped by type
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getVisionMissionPageData = async () => {
    try {
        const [heroResult, itemsResult] = await Promise.all([
            getVisionMissionHero(),
            getVisionMissionItems(),
        ]);

        const items = itemsResult.success ? itemsResult.data : [];

        // Group items by type
        const visionItems = items.filter(item => item.type === 'vision');
        const missionItems = items.filter(item => item.type === 'mission');
        const goalsItems = items.filter(item => item.type === 'goals');
        const valuesItems = items.filter(item => item.type === 'values');

        return {
            success: true,
            data: {
                hero: heroResult.success ? heroResult.data : null,
                vision: visionItems,
                mission: missionItems,
                goals: goalsItems,
                values: valuesItems,
                allItems: items,
            },
        };
    } catch (error) {
        console.error('Error fetching vision mission page data:', error);
        return { success: false, error: error.message };
    }
};

export default {
    getHero: getVisionMissionHero,
    getItems: getVisionMissionItems,
    getByType: getVisionMissionByType,
    getItemById: getVisionMissionItemById,
    getPageData: getVisionMissionPageData,
};