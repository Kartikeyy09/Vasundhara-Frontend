// src/utils/tokenUtils.js
import { TOKEN_KEY, USER_KEY } from './constants';
import { setCookie, getCookie, removeCookie } from './cookieUtils';

// Token management
export const setToken = (token) => {
    setCookie(TOKEN_KEY, token, 7); // 7 days
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return getCookie(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
    removeCookie(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
};

// User management
export const setUser = (user) => {
    const userString = JSON.stringify(user);
    setCookie(USER_KEY, userString, 7);
    localStorage.setItem(USER_KEY, userString);
};

export const getUser = () => {
    try {
        const userString = getCookie(USER_KEY) || localStorage.getItem(USER_KEY);
        return userString ? JSON.parse(userString) : null;
    } catch {
        return null;
    }
};

export const removeUser = () => {
    removeCookie(USER_KEY);
    localStorage.removeItem(USER_KEY);
};

// Check if token is expired
export const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= exp;
    } catch {
        return true;
    }
};

// Get token payload
export const getTokenPayload = (token) => {
    if (!token) return null;

    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
};

// Clear all auth data
export const clearAuthData = () => {
    removeToken();
    removeUser();
};