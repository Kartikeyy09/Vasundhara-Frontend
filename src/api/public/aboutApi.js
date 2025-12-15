// src/api/public/aboutApi.js
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

    // If useUpload is true, construct URL using IMAGES helper
    if (useUpload) {
        return IMAGES.url(imageUrl);
    }

    return imageUrl;
};

/**
 * Fetch all about cards for home page
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getAboutCards = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.ABOUT.LIST}`, {
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
            // Sort by order and add computed image URL
            const transformedData = [...data]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map(item => ({
                    ...item,
                    computedImageUrl: getImageUrl(item.mainImage, item.useUpload),
                }));

            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching about cards:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch single about card by ID
 * @param {string} id - Card ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getAboutCardById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.ABOUT.DETAIL(id)}`, {
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
                computedImageUrl: getImageUrl(data.mainImage, data.useUpload),
            },
        };
    } catch (error) {
        console.error('Error fetching about card:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch first about card (for single display)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getFirstAboutCard = async () => {
    try {
        const result = await getAboutCards();

        if (result.success && result.data?.length > 0) {
            return { success: true, data: result.data[0] };
        }

        return { success: false, error: 'No about data found' };
    } catch (error) {
        console.error('Error fetching first about card:', error);
        return { success: false, error: error.message };
    }
};

export default {
    getAll: getAboutCards,
    getById: getAboutCardById,
    getFirst: getFirstAboutCard,
};