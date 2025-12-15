// src/api/public/inquiriesApi.js
import { API_BASE_URL, ENDPOINTS } from '../../utils/constants';

/**
 * Submit contact form inquiry
 * @param {object} formData - Form data
 * @param {string} formData.name - Name (required)
 * @param {string} formData.email - Email (required)
 * @param {string} formData.phone - Phone number (required)
 * @param {string} formData.city - City (required)
 * @param {string} formData.organization - Organization/Company (required)
 * @param {string} formData.subject - Subject (optional)
 * @param {string} formData.message - Message (optional)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const submitInquiry = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.INQUIRIES_ROUTES.CREATE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        return { success: false, error: error.message };
    }
};

export default {
    submit: submitInquiry,
};