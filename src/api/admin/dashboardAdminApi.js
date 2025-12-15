// src/api/admin/dashboardAdminApi.js
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

/* ========================================================================
   MAIN DASHBOARD STATS
   ======================================================================== */

/**
 * Get full dashboard statistics
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getDashboardStats = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.DASHBOARD_ROUTES.STATS}`,
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
        return { success: true, data: result.data || result };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return { success: false, error: error.message };
    }
};

/* ========================================================================
   QUICK COUNTS (Lightweight)
   ======================================================================== */

/**
 * Get quick counts for dashboard
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getQuickCounts = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.DASHBOARD_ROUTES.COUNTS}`,
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
        return { success: true, data: result.data || result };
    } catch (error) {
        console.error('Error fetching quick counts:', error);
        return { success: false, error: error.message };
    }
};

/* ========================================================================
   RECENT ACTIVITY
   ======================================================================== */

/**
 * Get recent activity feed
 * @param {number} limit - Number of activities to fetch (default: 10, max: 50)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getRecentActivity = async (limit = 10) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.DASHBOARD_ROUTES.ACTIVITY}?limit=${limit}`,
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
        return { success: true, data: result.data || result };
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        return { success: false, error: error.message };
    }
};

/* ========================================================================
   INQUIRY ANALYTICS
   ======================================================================== */

/**
 * Get inquiry analytics
 * @param {string} period - Period: '7days' | '30days' | '12months' | 'year'
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getInquiryAnalytics = async (period = '30days') => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.DASHBOARD_ROUTES.INQUIRY_ANALYTICS}?period=${period}`,
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
        return { success: true, data: result.data || result };
    } catch (error) {
        console.error('Error fetching inquiry analytics:', error);
        return { success: false, error: error.message };
    }
};

/* ========================================================================
   INVOICE ANALYTICS
   ======================================================================== */

/**
 * Get invoice/revenue analytics
 * @param {string} period - Period: '30days' | '12months' | 'year' | 'all'
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getInvoiceAnalytics = async (period = '12months') => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.DASHBOARD_ROUTES.INVOICE_ANALYTICS}?period=${period}`,
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
        return { success: true, data: result.data || result };
    } catch (error) {
        console.error('Error fetching invoice analytics:', error);
        return { success: false, error: error.message };
    }
};

/* ========================================================================
   CONTENT ANALYTICS
   ======================================================================== */

/**
 * Get content analytics
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getContentAnalytics = async () => {
    try {
        const response = await fetch(
            `${API_BASE_URL}${ENDPOINTS.DASHBOARD_ROUTES.CONTENT_ANALYTICS}`,
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
        return { success: true, data: result.data || result };
    } catch (error) {
        console.error('Error fetching content analytics:', error);
        return { success: false, error: error.message };
    }
};

/* ========================================================================
   HELPER FUNCTIONS
   ======================================================================== */

/**
 * Format currency (INR)
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
};

/**
 * Format number with commas
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Format percentage
 * @param {number} value
 * @param {boolean} showSign
 * @returns {string}
 */
export const formatPercentage = (value, showSign = true) => {
    if (value === undefined || value === null) return '0%';
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value}%`;
};

/**
 * Format date for display
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

/**
 * Format date time for display
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string|Date} date
 * @returns {string}
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;

    return formatDate(date);
};

/**
 * Get trend icon and color
 * @param {string} trend - 'up' or 'down'
 * @param {number} changePercent
 * @returns {object}
 */
export const getTrendInfo = (trend, changePercent) => {
    const isPositive = trend === 'up';
    return {
        icon: isPositive ? '↑' : '↓',
        color: isPositive ? 'text-green-600' : 'text-red-600',
        bgColor: isPositive ? 'bg-green-100' : 'bg-red-100',
        text: formatPercentage(changePercent),
    };
};

export default {
    // Main endpoints
    getStats: getDashboardStats,
    getCounts: getQuickCounts,
    getActivity: getRecentActivity,
    getInquiryAnalytics,
    getInvoiceAnalytics,
    getContentAnalytics,
    // Formatters
    formatCurrency,
    formatNumber,
    formatPercentage,
    formatDate,
    formatDateTime,
    getRelativeTime,
    getTrendInfo,
};