import apiService from './api';
import { ENDPOINTS } from '../utils/constants';
import { setToken, setUser, clearAuthData, getToken, getUser } from '../utils/tokenUtils';

export const authService = {
    // Login
    async login(email, password) {
        const response = await apiService.post(ENDPOINTS.LOGIN, { email, password }, false);

        if (response.token) {
            setToken(response.token);
            setUser(response.user);
        }

        return response;
    },

    // Logout
    logout() {
        clearAuthData();
        window.location.href = '/login';
    },

    // Check if user is authenticated
    isAuthenticated() {
        const token = getToken();
        return !!token;
    },

    // Get current user
    getCurrentUser() {
        return getUser();
    },

    // Get current token
    getToken() {
        return getToken();
    },

    // Check if user has admin role
    isAdmin() {
        const user = getUser();
        return user?.role === 'Admin';
    },
};

export default authService;