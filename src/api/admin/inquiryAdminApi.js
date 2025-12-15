// src/api/admin/inquiryAdminApi.js
import { API_BASE_URL, ENDPOINTS } from '../../utils/constants';
import { getToken } from '../../utils/tokenUtils';

/**
 * Get auth headers
 */
const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

/**
 * Transform inquiry item from API response
 */
const transformInquiryItem = (item) => ({
    ...item,
    id: item._id || item.id,
    // Format dates for display
    formattedReceivedAt: item.receivedAt
        ? new Date(item.receivedAt).toLocaleString()
        : '',
    formattedCreatedAt: item.createdAt
        ? new Date(item.createdAt).toLocaleString()
        : '',
    // Check if inquiry is new
    isNew: item.status === 'New',
    // Check if inquiry is read
    isRead: item.status === 'Read',
});

/**
 * Get all inquiries (Admin only)
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getInquiries = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.INQUIRIES_ROUTES.LIST}`,
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
            const transformedData = data.map(transformInquiryItem);
            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get inquiry by ID (Admin only) - Also marks as Read
 * @param {string} id - Inquiry ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getInquiryById = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.INQUIRIES_ROUTES.DETAIL(id)}`,
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
        return { success: true, data: transformInquiryItem(data) };
    } catch (error) {
        console.error('Error fetching inquiry by ID:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create inquiry (Public - for contact form)
 * @param {object} inquiryData - { name, email, phone, city?, organization?, subject?, message }
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const createInquiry = async (inquiryData) => {
    try {
        // Validate required fields
        if (!inquiryData.name || String(inquiryData.name).trim() === '') {
            throw new Error('Name is required');
        }
        if (!inquiryData.email || String(inquiryData.email).trim() === '') {
            throw new Error('Email is required');
        }
        if (!inquiryData.phone || String(inquiryData.phone).trim() === '') {
            throw new Error('Phone is required');
        }
        if (!inquiryData.message || String(inquiryData.message).trim() === '') {
            throw new Error('Message is required');
        }

        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.INQUIRIES_ROUTES.CREATE}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: inquiryData.name.trim(),
                    email: inquiryData.email.trim(),
                    phone: inquiryData.phone.trim(),
                    city: inquiryData.city?.trim() || '',
                    organization: inquiryData.organization?.trim() || inquiryData.company?.trim() || '',
                    subject: inquiryData.subject?.trim() || 'New Contact Inquiry',
                    message: inquiryData.message.trim(),
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const item = data.data || data;
        return { success: true, data: transformInquiryItem(item), message: data.message };
    } catch (error) {
        console.error('Error creating inquiry:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete inquiry (Admin only)
 * @param {string} id - Inquiry ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteInquiry = async (id) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.INQUIRIES_ROUTES.DELETE(id)}`,
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
        console.error('Error deleting inquiry:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete multiple inquiries (Admin only)
 * @param {string[]} ids - Array of Inquiry IDs
 * @returns {Promise<{success: boolean, deletedCount?: number, error?: string}>}
 */
export const deleteMultipleInquiries = async (ids) => {
    try {
        let deletedCount = 0;
        const errors = [];

        for (const id of ids) {
            const result = await deleteInquiry(id);
            if (result.success) {
                deletedCount++;
            } else {
                errors.push({ id, error: result.error });
            }
        }

        if (errors.length > 0 && deletedCount === 0) {
            throw new Error('Failed to delete any inquiries');
        }

        return { success: true, deletedCount, errors: errors.length > 0 ? errors : undefined };
    } catch (error) {
        console.error('Error deleting multiple inquiries:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get inquiry statistics
 * @param {Array} inquiries - Array of inquiry items
 * @returns {object} - Statistics object
 */
export const getInquiryStats = (inquiries) => {
    if (!Array.isArray(inquiries)) {
        return { total: 0, new: 0, read: 0 };
    }

    return {
        total: inquiries.length,
        new: inquiries.filter((i) => i.status === 'New').length,
        read: inquiries.filter((i) => i.status === 'Read').length,
    };
};

/**
 * Filter inquiries by status
 * @param {Array} inquiries - Array of inquiry items
 * @param {string} status - 'all', 'new', or 'read'
 * @returns {Array} - Filtered inquiries
 */
export const filterInquiriesByStatus = (inquiries, status) => {
    if (!Array.isArray(inquiries)) return [];
    if (status === 'all') return inquiries;
    if (status === 'new') return inquiries.filter((i) => i.status === 'New');
    if (status === 'read') return inquiries.filter((i) => i.status === 'Read');
    return inquiries;
};

/**
 * Search inquiries
 * @param {Array} inquiries - Array of inquiry items
 * @param {string} searchTerm - Search term
 * @returns {Array} - Filtered inquiries
 */
export const searchInquiries = (inquiries, searchTerm) => {
    if (!Array.isArray(inquiries) || !searchTerm) return inquiries;

    const term = searchTerm.toLowerCase().trim();
    return inquiries.filter((inquiry) => {
        return (
            inquiry.name?.toLowerCase().includes(term) ||
            inquiry.email?.toLowerCase().includes(term) ||
            inquiry.phone?.toLowerCase().includes(term) ||
            inquiry.city?.toLowerCase().includes(term) ||
            inquiry.organization?.toLowerCase().includes(term) ||
            inquiry.subject?.toLowerCase().includes(term) ||
            inquiry.message?.toLowerCase().includes(term)
        );
    });
};

export default {
    getAll: getInquiries,
    getById: getInquiryById,
    create: createInquiry,
    delete: deleteInquiry,
    deleteMultiple: deleteMultipleInquiries,
    getStats: getInquiryStats,
    filterByStatus: filterInquiriesByStatus,
    search: searchInquiries,
};