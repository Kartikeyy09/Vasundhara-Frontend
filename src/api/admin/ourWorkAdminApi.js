// src/api/admin/ourWorkAdminApi.js
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
 * Get proper image URL (works with uploads + absolute URLs)
 */
const getImageUrl = (imageUrl, useUpload = false) => {
    if (!imageUrl) return '';

    // Absolute URL already
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

    // Backend-style upload path (/uploads/...)
    if (imageUrl.startsWith('/uploads')) {
        return IMAGES.url(imageUrl);
    }

    // If DB just stores filename and flag says it's an upload
    if (useUpload) {
        return IMAGES.url(imageUrl);
    }

    // Otherwise treat as-is (already full URL or CDN)
    return imageUrl;
};

/**
 * Normalize solutions block
 */
const normalizeSolutions = (solutions) => {
    if (!solutions || Array.isArray(solutions)) {
        return { title: '', description: '', images: Array.isArray(solutions) ? solutions : [] };
    }

    const images = Array.isArray(solutions.images) ? solutions.images : [];

    return {
        title: solutions.title || '',
        description: solutions.description || '',
        images,
    };
};

/**
 * Transform a full OurWork item (admin use)
 * - Adds computed URLs
 * - Normalizes nested structures
 */
const transformOurWorkItem = (item) => {
    if (!item) return null;

    const id = item.id || item._id;
    const solutions = normalizeSolutions(item.solutions);
    const gallery = Array.isArray(item.gallery) ? item.gallery : [];

    return {
        ...item,
        id,
        name: item.title, // convenience for AdminOurWork component

        // Cover / card
        coverComputedUrl: getImageUrl(item.coverImageUrl, item.coverUseUpload),

        // Hero
        heroComputedUrl: getImageUrl(item.heroImageUrl, item.heroUseUpload),

        // What We Do image
        whatComputedUrl: getImageUrl(item.whatImageUrl, item.whatUseUpload),

        // Solutions block (1–4 images, uploads only)
        solutions: {
            title: solutions.title,
            description: solutions.description,
            images: [...solutions.images]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((img) => ({
                    ...img,
                    computedUrl: IMAGES.url(img.imageUrl),
                })),
        },

        // Gallery block (3–6 images, uploads only)
        gallery: [...gallery]
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((img) => ({
                ...img,
                computedUrl: IMAGES.url(img.imageUrl),
            })),

        // Map to component-friendly structure
        hero: {
            bgImage: getImageUrl(item.heroImageUrl, item.heroUseUpload),
            title: item.heroTitle || '',
        },
        ensuringAccess: {
            image: getImageUrl(item.coverImageUrl, item.coverUseUpload),
            title: item.title || '',
            description: '',
            buttonText: 'Enquire Now',
            buttonLink: '#',
        },
        whySection: {
            title: item.whyTitle || '',
            description: item.whyDescription || '',
        },
        whatWeDo: {
            title: item.whatTitle || '',
            description: item.whatDescription || '',
            image: getImageUrl(item.whatImageUrl, item.whatUseUpload),
        },
        solutionsSection: {
            title: solutions.title,
            description: solutions.description,
            images: solutions.images.map((img) => IMAGES.url(img.imageUrl)),
        },
        gallerySection: {
            title: 'Image Gallery',
            images: gallery.map((img) => IMAGES.url(img.imageUrl)),
        },
    };
};

/**
 * Transform summary item (for cards list)
 */
const transformSummaryItem = (item) => {
    if (!item) return null;
    const id = item.id || item._id;

    return {
        ...item,
        id,
        name: item.title,
        coverComputedUrl: getImageUrl(item.coverImageUrl, item.coverUseUpload),
    };
};

/* ========== READ ========== */

/**
 * Get Our Work summary list (cards) – public GET, used in admin too
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getOurWorkSummary = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.OUR_WORK_ROUTES.SUMMARY}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `HTTP error! status: ${response.status}`
            );
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            const transformed = data
                .map(transformSummaryItem)
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            return { success: true, data: transformed };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching Our Work summary:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get full admin list of Our Work items
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getOurWorkItems = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.OUR_WORK_ROUTES.LIST}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `HTTP error! status: ${response.status}`
            );
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            const transformed = data
                .map(transformOurWorkItem)
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            return { success: true, data: transformed };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching Our Work items:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get single Our Work item by ID (full detail)
 * @param {string} id
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getOurWorkById = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.OUR_WORK_ROUTES.DETAIL(id)}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `HTTP error! status: ${response.status}`
            );
        }

        const data = await response.json();
        return { success: true, data: transformOurWorkItem(data) };
    } catch (error) {
        console.error('Error fetching Our Work by ID:', error);
        return { success: false, error: error.message };
    }
};

/* ========== CREATE ========== */

/**
 * Create new Our Work base item (card)
 *
 * Backend expects:
 *  - title (required)
 *  - EITHER:
 *      - coverImage (File, field name "coverImage")  → upload
 *      - OR coverImageUrl (string)                  → external URL
 *
 * @param {object} ourWorkData - { title, order?, coverImageUrl? }
 * @param {File|null} coverFile - optional uploaded cover image
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const createOurWork = async (ourWorkData, coverFile = null) => {
    try {
        let body;
        let headers;

        if (!ourWorkData || !ourWorkData.title) {
            throw new Error('Title is required');
        }

        if (coverFile) {
            // Multipart/form-data with coverImage file
            const formData = new FormData();
            formData.append('title', ourWorkData.title || '');
            if (ourWorkData.order !== undefined) {
                formData.append('order', ourWorkData.order);
            }
            // Backend derives coverUseUpload=1 from presence of file
            formData.append('coverImage', coverFile);

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            // JSON payload using coverImageUrl
            if (!ourWorkData.coverImageUrl) {
                throw new Error(
                    'coverImageUrl is required when no cover image file is provided.'
                );
            }

            body = JSON.stringify({
                title: ourWorkData.title,
                coverImageUrl: ourWorkData.coverImageUrl,
                coverUseUpload: false, // explicitly URL-based
                order: ourWorkData.order ?? 0,
            });
            headers = getAuthHeaders(false);
        }

        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.OUR_WORK_ROUTES.CREATE}`,
            {
                method: 'POST',
                headers,
                body,
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `HTTP error! status: ${response.status}`
            );
        }

        const data = await response.json();
        const item = data.item || data;
        return { success: true, data: transformOurWorkItem(item) };
    } catch (error) {
        console.error('Error creating Our Work item:', error);
        return { success: false, error: error.message };
    }
};

/* ========== UPDATE ========== */

/**
 * Update an existing Our Work item (full entry)
 *
 * ourWorkData can include any of:
 *  - title, order
 *  - coverUseUpload, coverToggle, coverImageUrl
 *  - heroTitle, heroUseUpload, heroToggle, heroImageUrl
 *  - whyTitle, whyDescription
 *  - whatTitle, whatDescription, whatUseUpload, whatToggle, whatImageUrl
 *  - solutionsTitle, solutionsDescription
 *
 * files can include:
 *  - coverImage: File (single)
 *  - heroImage: File (single)
 *  - whatImage: File (single)
 *  - solutionsImages: File[] (1–4)
 *  - galleryImages: File[] (3–6)
 *
 * NOTE: Providing new solutionsImages will REPLACE the existing set.
 *       Providing new galleryImages will REPLACE the existing set.
 *
 * @param {string} id
 * @param {object} ourWorkData - plain fields
 * @param {object} files - file fields as described above
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updateOurWork = async (id, ourWorkData = {}, files = {}) => {
    try {
        const hasFiles =
            files.coverImage ||
            files.heroImage ||
            files.whatImage ||
            (Array.isArray(files.solutionsImages) &&
                files.solutionsImages.length > 0) ||
            (Array.isArray(files.galleryImages) && files.galleryImages.length > 0);

        let body;
        let headers;

        if (hasFiles) {
            const formData = new FormData();

            // Attach text fields
            Object.entries(ourWorkData || {}).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });

            // Single files
            if (files.coverImage) {
                formData.append('coverImage', files.coverImage);
            }
            if (files.heroImage) {
                formData.append('heroImage', files.heroImage);
            }
            if (files.whatImage) {
                formData.append('whatImage', files.whatImage);
            }

            // Multi-files
            if (Array.isArray(files.solutionsImages)) {
                files.solutionsImages.forEach((file) => {
                    if (file) formData.append('solutionsImages', file);
                });
            }

            if (Array.isArray(files.galleryImages)) {
                files.galleryImages.forEach((file) => {
                    if (file) formData.append('galleryImages', file);
                });
            }

            body = formData;
            headers = getAuthHeaders(true);
        } else {
            // JSON-only update (no new files)
            body = JSON.stringify(ourWorkData || {});
            headers = getAuthHeaders(false);
        }

        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.OUR_WORK_ROUTES.UPDATE(id)}`,
            {
                method: 'PUT',
                headers,
                body,
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `HTTP error! status: ${response.status}`
            );
        }

        const data = await response.json();
        const item = data.item || data;
        return { success: true, data: transformOurWorkItem(item) };
    } catch (error) {
        console.error('Error updating Our Work item:', error);
        return { success: false, error: error.message };
    }
};

/* ========== DELETE ========== */

/**
 * Delete a single Our Work item
 * @param {string} id
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteOurWork = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.OUR_WORK_ROUTES.DELETE(id)}`,
            {
                method: 'DELETE',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `HTTP error! status: ${response.status}`
            );
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting Our Work item:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete ALL Our Work items (reset)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteAllOurWork = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.OUR_WORK_ROUTES.RESET}`,
            {
                method: 'DELETE',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `HTTP error! status: ${response.status}`
            );
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting all Our Work items:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Helper to convert File to base64 data URL (for previews)
 * @param {File} file
 * @returns {Promise<string>}
 */
export const fileToDataURL = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

export default {
    getSummary: getOurWorkSummary,
    getAll: getOurWorkItems,
    getById: getOurWorkById,
    create: createOurWork,
    update: updateOurWork,
    delete: deleteOurWork,
    deleteAll: deleteAllOurWork,
    fileToDataURL,
};