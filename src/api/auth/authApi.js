// src/api/auth/authApi.js
import { API_BASE_URL, ENDPOINTS } from '../../utils/constants';
import { setToken, setUser, clearAuthData, getToken } from '../../utils/tokenUtils';

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_ROUTES.LOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store token and user data
        if (data.token) {
            setToken(data.token);
        }
        if (data.user) {
            setUser(data.user);
        }

        return { success: true, data };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Logout user
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const logoutUser = async () => {
    try {
        const token = getToken();

        // Call logout endpoint if token exists
        if (token) {
            await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_ROUTES.LOGOUT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).catch(() => {
                // Ignore errors, we'll clear local data anyway
            });
        }

        // Clear local auth data
        clearAuthData();

        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        clearAuthData(); // Still clear local data
        return { success: false, error: error.message };
    }
};

/**
 * Change password (authenticated user)
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const changePassword = async (currentPassword, newPassword) => {
    try {
        const token = getToken();

        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_ROUTES.CHANGE_PASSWORD}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to change password');
        }

        return { success: true, data };
    } catch (error) {
        console.error('Change password error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Forgot password - Request reset link
 * @param {string} email - User email
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const forgotPassword = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_ROUTES.FORGOT_PASSWORD}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send reset link');
        }

        return { success: true, data };
    } catch (error) {
        console.error('Forgot password error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Reset password with token
 * @param {string} token - Reset token from email link
 * @param {string} newPassword - New password
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const resetPassword = async (token, newPassword) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH_ROUTES.RESET_PASSWORD(token)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to reset password');
        }

        return { success: true, data };
    } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, error: error.message };
    }
};

// Default export with all functions
export default {
    login: loginUser,
    logout: logoutUser,
    changePassword,
    forgotPassword,
    resetPassword,
};