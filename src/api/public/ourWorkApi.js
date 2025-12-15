// src/api/public/ourWorkApi.js
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
 * Fetch our work summary (cards for homepage)
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getOurWorkSummary = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.OUR_WORK_ROUTES.SUMMARY}`, {
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
                    computedImageUrl: getImageUrl(item.coverImageUrl, item.coverUseUpload),
                    link: `/our-work/${item.id || item._id}`,
                }));

            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching our work summary:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch all our work items (full details)
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getOurWorkList = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.OUR_WORK_ROUTES.LIST}`, {
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
                .map(item => transformOurWorkItem(item));

            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching our work list:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Transform our work item with all image URLs
 * @param {object} item - Our work item
 * @returns {object} - Transformed item
 */
const transformOurWorkItem = (item) => {
    if (!item) return item;

    return {
        ...item,
        // Cover image
        computedCoverImage: getImageUrl(item.coverImageUrl, item.coverUseUpload),
        // Hero image
        computedHeroImage: getImageUrl(item.heroImageUrl, item.heroUseUpload),
        // What section image
        computedWhatImage: getImageUrl(item.whatImageUrl, item.whatUseUpload),
        // Solutions images
        computedSolutionsImages: item.solutions?.images
            ? [...item.solutions.images]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map(img => ({
                    ...img,
                    computedImageUrl: getImageUrl(img.imageUrl, img.useUpload),
                }))
            : [],
        // Gallery images
        computedGalleryImages: item.gallery
            ? [...item.gallery]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map(img => ({
                    ...img,
                    computedImageUrl: getImageUrl(img.imageUrl, img.useUpload),
                }))
            : [],
    };
};

/**
 * Fetch single our work item by ID
 * @param {string} id - Item ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getOurWorkById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.OUR_WORK_ROUTES.DETAIL(id)}`, {
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
            data: transformOurWorkItem(data),
        };
    } catch (error) {
        console.error('Error fetching our work item:', error);
        return { success: false, error: error.message };
    }
};

export default {
    getSummary: getOurWorkSummary,
    getAll: getOurWorkList,
    getById: getOurWorkById,
};