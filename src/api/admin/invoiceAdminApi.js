// src/api/admin/invoiceAdminApi.js
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
 * Transform invoice item from API response
 */
const transformInvoiceItem = (item) => ({
    ...item,
    id: item._id || item.id,
    // Map backend field names to frontend field names if needed
    supplierRef: item.suppliersRef || item.supplierRef || '',
    buyerOrder: item.buyersOrderNo || item.buyerOrder || '',
});

/**
 * Transform invoice data for API request (frontend -> backend)
 */
const transformForApi = (invoiceData) => {
    const { id, _id, createdAt, updatedAt, ...data } = invoiceData;

    return {
        ...data,
        // Map frontend field names to backend field names
        suppliersRef: data.supplierRef || data.suppliersRef || '',
        buyersOrderNo: data.buyerOrder || data.buyersOrderNo || '',
        deliveryNoteDate: data.deliveryNoteDate || '',
        despatchedThrough: data.despatchedThrough || '',
        // Ensure items have correct structure
        items: (data.items || []).map(item => ({
            description: item.description || '',
            hsn: item.hsn || '',
            amount: parseFloat(item.amount) || 0,
            cgstRate: parseFloat(item.cgstRate) || 0,
            sgstRate: parseFloat(item.sgstRate) || 0,
            igstRate: parseFloat(item.igstRate) || 0,
        })),
    };
};

/**
 * Get all invoices
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getInvoices = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVOICES_ROUTES.LIST}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            const transformedData = data.map(transformInvoiceItem);
            return { success: true, data: transformedData };
        }

        return { success: true, data: [] };
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get invoice by ID
 * @param {string} id - Invoice ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getInvoiceById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVOICES_ROUTES.DETAIL(id)}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: transformInvoiceItem(data) };
    } catch (error) {
        console.error('Error fetching invoice by ID:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create invoice
 * @param {object} invoiceData - Invoice data
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const createInvoice = async (invoiceData) => {
    try {
        const apiData = transformForApi(invoiceData);

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVOICES_ROUTES.CREATE}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(apiData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: transformInvoiceItem(data) };
    } catch (error) {
        console.error('Error creating invoice:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update invoice
 * @param {string} id - Invoice ID
 * @param {object} invoiceData - Invoice data to update
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const updateInvoice = async (id, invoiceData) => {
    try {
        const apiData = transformForApi(invoiceData);

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVOICES_ROUTES.UPDATE(id)}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(apiData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: transformInvoiceItem(data) };
    } catch (error) {
        console.error('Error updating invoice:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete invoice
 * @param {string} id - Invoice ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteInvoice = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INVOICES_ROUTES.DELETE(id)}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting invoice:', error);
        return { success: false, error: error.message };
    }
};

export default {
    getAll: getInvoices,
    getById: getInvoiceById,
    create: createInvoice,
    update: updateInvoice,
    delete: deleteInvoice,
};