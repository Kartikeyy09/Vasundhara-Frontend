import { API_BASE_URL } from '../utils/constants';
import { getToken, clearAuthData, isTokenExpired } from '../utils/tokenUtils';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Get headers with authentication
    getHeaders(includeAuth = true, isFormData = false) {
        const headers = {};

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        if (includeAuth) {
            const token = getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    // Check authentication before request
    checkAuth() {
        const token = getToken();
        if (!token || isTokenExpired(token)) {
            clearAuthData();
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }
    }

    // Handle response
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            // Handle 401 Unauthorized
            if (response.status === 401) {
                clearAuthData();
                window.location.href = '/login';
                throw new Error('Session expired. Please login again.');
            }

            // Handle other errors
            const errorMessage = data?.message || data?.error || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return data;
    }

    // GET request
    async get(endpoint, requireAuth = true) {
        if (requireAuth) {
            this.checkAuth();
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'GET',
            headers: this.getHeaders(requireAuth),
        });

        return this.handleResponse(response);
    }

    // POST request
    async post(endpoint, data, requireAuth = true, isFormData = false) {
        if (requireAuth) {
            this.checkAuth();
        }

        const body = isFormData ? data : JSON.stringify(data);

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(requireAuth, isFormData),
            body,
        });

        return this.handleResponse(response);
    }

    // PUT request
    async put(endpoint, data, requireAuth = true, isFormData = false) {
        if (requireAuth) {
            this.checkAuth();
        }

        const body = isFormData ? data : JSON.stringify(data);

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            headers: this.getHeaders(requireAuth, isFormData),
            body,
        });

        return this.handleResponse(response);
    }

    // PATCH request
    async patch(endpoint, data, requireAuth = true, isFormData = false) {
        if (requireAuth) {
            this.checkAuth();
        }

        const body = isFormData ? data : JSON.stringify(data);

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PATCH',
            headers: this.getHeaders(requireAuth, isFormData),
            body,
        });

        return this.handleResponse(response);
    }

    // DELETE request
    async delete(endpoint, requireAuth = true) {
        if (requireAuth) {
            this.checkAuth();
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders(requireAuth),
        });

        return this.handleResponse(response);
    }
}

export const apiService = new ApiService();
export default apiService;