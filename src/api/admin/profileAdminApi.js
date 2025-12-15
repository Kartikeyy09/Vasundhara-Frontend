// src/api/admin/profileAdminApi.js
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
 * Transform profile item from API response
 */
const transformProfileItem = (item) => {
    if (!item) return null;

    return {
        ...item,
        id: item._id || item.id,
        computedProfilePicture: getImageUrl(item.profilePicture, item.useUpload),
        // Ensure socialLinks has all fields
        socialLinks: {
            facebook: item.socialLinks?.facebook || '',
            twitter: item.socialLinks?.twitter || '',
            instagram: item.socialLinks?.instagram || '',
            linkedin: item.socialLinks?.linkedin || '',
            youtube: item.socialLinks?.youtube || '',
        },
    };
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
   PUBLIC API
   ======================================================================== */

/**
 * Get profile for public website display
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getPublicProfile = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.PROFILE_ROUTES.GET}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const data = result.data || result;
        return { success: true, data: transformProfileItem(data) };
    } catch (error) {
        console.error('Error fetching public profile:', error);
        return { success: false, error: error.message };
    }
};

/* ========================================================================
   ADMIN API
   ======================================================================== */

/**
 * Get profile for admin panel
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getAdminProfile = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.PROFILE_ROUTES.GET_ADMIN}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const data = result.data || result;
        return { success: true, data: transformProfileItem(data) };
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create or update profile (upsert)
 * @param {object} profileData - Profile data
 * @param {File|null} profilePictureFile - Optional profile picture file
 * @returns {Promise<{success: boolean, data?: object, message?: string, error?: string}>}
 */
export const upsertProfile = async (profileData, profilePictureFile = null) => {
    try {
        let body;
        let headers;

        // Validate required fields
        if (!profileData.ngoName || String(profileData.ngoName).trim() === '') {
            throw new Error('NGO Name is required');
        }

        if (!profileData.mobileNo || String(profileData.mobileNo).trim() === '') {
            throw new Error('Mobile number is required');
        }

        if (profilePictureFile) {
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('profilePicture', profilePictureFile);
            formData.append('useUpload', 'true');

            // Append all other fields
            if (profileData.ngoName !== undefined) formData.append('ngoName', profileData.ngoName);
            if (profileData.description !== undefined) formData.append('description', profileData.description);
            if (profileData.mobileNo !== undefined) formData.append('mobileNo', profileData.mobileNo);
            if (profileData.email !== undefined) formData.append('email', profileData.email);
            if (profileData.website !== undefined) formData.append('website', profileData.website);
            if (profileData.address !== undefined) formData.append('address', profileData.address);

            // Social links - append as individual fields
            if (profileData.socialLinks) {
                if (profileData.socialLinks.facebook !== undefined) formData.append('facebook', profileData.socialLinks.facebook);
                if (profileData.socialLinks.twitter !== undefined) formData.append('twitter', profileData.socialLinks.twitter);
                if (profileData.socialLinks.instagram !== undefined) formData.append('instagram', profileData.socialLinks.instagram);
                if (profileData.socialLinks.linkedin !== undefined) formData.append('linkedin', profileData.socialLinks.linkedin);
                if (profileData.socialLinks.youtube !== undefined) formData.append('youtube', profileData.socialLinks.youtube);
            }

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            // Use JSON
            body = JSON.stringify({
                ...profileData,
                useUpload: profileData.useUpload ?? false,
            });
            headers = getAuthHeaders(false);
        }

        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.PROFILE_ROUTES.UPSERT}`,
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

        const result = await response.json();
        const data = result.data || result;
        return {
            success: true,
            data: transformProfileItem(data),
            message: result.message || 'Profile updated successfully',
        };
    } catch (error) {
        console.error('Error upserting profile:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update profile picture only
 * @param {File|null} profilePictureFile - Profile picture file (for upload)
 * @param {string|null} profilePictureUrl - Profile picture URL (for URL mode)
 * @param {boolean} useUpload - Whether using file upload or URL
 * @returns {Promise<{success: boolean, data?: object, message?: string, error?: string}>}
 */
export const updateProfilePicture = async (profilePictureFile = null, profilePictureUrl = null, useUpload = true) => {
    try {
        let body;
        let headers;

        if (useUpload) {
            if (!profilePictureFile) {
                throw new Error('Profile picture file is required');
            }

            const formData = new FormData();
            formData.append('profilePicture', profilePictureFile);
            formData.append('useUpload', 'true');

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            if (!profilePictureUrl || String(profilePictureUrl).trim() === '') {
                throw new Error('Profile picture URL is required');
            }

            body = JSON.stringify({
                profilePicture: profilePictureUrl.trim(),
                useUpload: false,
            });
            headers = getAuthHeaders(false);
        }

        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.PROFILE_ROUTES.UPDATE_PICTURE}`,
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

        const result = await response.json();
        return {
            success: true,
            data: result.data || result,
            message: result.message || 'Profile picture updated successfully',
        };
    } catch (error) {
        console.error('Error updating profile picture:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete profile picture
 * @returns {Promise<{success: boolean, data?: object, message?: string, error?: string}>}
 */
export const deleteProfilePicture = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.PROFILE_ROUTES.DELETE_PICTURE}`,
            {
                method: 'DELETE',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const data = result.data || result;
        return {
            success: true,
            data: transformProfileItem(data),
            message: result.message || 'Profile picture removed successfully',
        };
    } catch (error) {
        console.error('Error deleting profile picture:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Reset profile to defaults
 * @returns {Promise<{success: boolean, data?: object, message?: string, error?: string}>}
 */
export const resetProfile = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.PROFILE_ROUTES.RESET}`,
            {
                method: 'DELETE',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const data = result.data || result;
        return {
            success: true,
            data: transformProfileItem(data),
            message: result.message || 'Profile reset to defaults successfully',
        };
    } catch (error) {
        console.error('Error resetting profile:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    if (!email || email.trim() === '') return true; // Optional field
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate website URL format
 * @param {string} url
 * @returns {boolean}
 */
export const isValidWebsite = (url) => {
    if (!url || url.trim() === '') return true; // Optional field
    return /^https?:\/\/.+/.test(url);
};

/**
 * Validate mobile number format
 * @param {string} mobile
 * @returns {boolean}
 */
export const isValidMobile = (mobile) => {
    if (!mobile || mobile.trim() === '') return false; // Required field
    return /^[\d\s\-\+]+$/.test(mobile);
};

export default {
    // Public
    getPublic: getPublicProfile,
    // Admin
    getAdmin: getAdminProfile,
    upsert: upsertProfile,
    updatePicture: updateProfilePicture,
    deletePicture: deleteProfilePicture,
    reset: resetProfile,
    // Validation helpers
    isValidEmail,
    isValidWebsite,
    isValidMobile,
    // Utility
    fileToDataURL,
};