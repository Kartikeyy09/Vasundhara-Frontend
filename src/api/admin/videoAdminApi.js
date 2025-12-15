// src/api/admin/videoAdminApi.js
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
 * Transform video item
 */
const transformVideoItem = (item) => ({
    ...item,
    id: item._id || item.id,
});

/**
 * Fetch all video items (Admin)
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getVideoItems = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.VIDEO.LIST}`, {
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
                .map(transformVideoItem);
            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching video items:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch single video item by ID
 * @param {string} id - Video ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getVideoById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.VIDEO.DETAIL(id)}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: transformVideoItem(data) };
    } catch (error) {
        console.error('Error fetching video by ID:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create new video item
 * @param {object} videoData - Video data
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const createVideo = async (videoData) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.VIDEO.CREATE}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                videoTitle: videoData.videoTitle,
                videoDescription: videoData.videoDescription || '',
                videoUrl: videoData.videoUrl,
                order: videoData.order || 0,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Handle both { item: ... } and direct response
        const item = data.item || data;
        return { success: true, data: transformVideoItem(item) };
    } catch (error) {
        console.error('Error creating video:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update video item
 * @param {string} id - Video ID
 * @param {object} videoData - Video data to update
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updateVideo = async (id, videoData) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.VIDEO.UPDATE(id)}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                videoTitle: videoData.videoTitle,
                videoDescription: videoData.videoDescription || '',
                videoUrl: videoData.videoUrl,
                order: videoData.order || 0,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const item = data.item || data;
        return { success: true, data: transformVideoItem(item) };
    } catch (error) {
        console.error('Error updating video:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete video item
 * @param {string} id - Video ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteVideo = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.VIDEO.DELETE(id)}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting video:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete all video items (bulk delete)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteAllVideos = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.VIDEO.RESET}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting all videos:', error);
        return { success: false, error: error.message };
    }
};

export default {
    getAll: getVideoItems,
    getById: getVideoById,
    create: createVideo,
    update: updateVideo,
    delete: deleteVideo,
    deleteAll: deleteAllVideos,
};