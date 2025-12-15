// src/api/public/videoApi.js
import { API_BASE_URL, ENDPOINTS } from '../../utils/constants';

/**
 * Convert YouTube URL to embed URL
 * @param {string} url - YouTube URL
 * @returns {string} - Embed URL
 */
const getEmbedUrl = (url) => {
    if (!url) return '';

    // If already an embed URL, return as is
    if (url.includes('/embed/')) {
        return url;
    }

    // Convert watch URL to embed URL
    // https://www.youtube.com/watch?v=VIDEO_ID -> https://www.youtube.com/embed/VIDEO_ID
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);

    if (videoIdMatch && videoIdMatch[1]) {
        return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }

    // If it's a direct video URL (mp4, etc.), return as is
    return url;
};

/**
 * Check if URL is a YouTube video
 * @param {string} url - Video URL
 * @returns {boolean}
 */
const isYouTubeUrl = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
};

/**
 * Fetch all videos
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getVideos = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.VIDEO.LIST}`, {
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
            // Sort by order and add computed fields
            const transformedData = [...data]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map(item => ({
                    ...item,
                    computedEmbedUrl: item.embedUrl || getEmbedUrl(item.videoUrl),
                    isYouTube: isYouTubeUrl(item.videoUrl) || isYouTubeUrl(item.embedUrl),
                }));

            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching videos:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch single video by ID
 * @param {string} id - Video ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getVideoById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.VIDEO.DETAIL(id)}`, {
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
                computedEmbedUrl: data.embedUrl || getEmbedUrl(data.videoUrl),
                isYouTube: isYouTubeUrl(data.videoUrl) || isYouTubeUrl(data.embedUrl),
            },
        };
    } catch (error) {
        console.error('Error fetching video:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Fetch first video
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getFirstVideo = async () => {
    try {
        const result = await getVideos();

        if (result.success && result.data?.length > 0) {
            return { success: true, data: result.data[0] };
        }

        return { success: false, error: 'No video data found' };
    } catch (error) {
        console.error('Error fetching first video:', error);
        return { success: false, error: error.message };
    }
};

export default {
    getAll: getVideos,
    getById: getVideoById,
    getFirst: getFirstVideo,
};