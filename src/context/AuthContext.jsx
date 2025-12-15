// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, getUser, clearAuthData, isTokenExpired, setToken, setUser as setStoredUser } from '../utils/tokenUtils';
import { loginUser, logoutUser } from '../api/auth/authApi';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setTokenState] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = getToken();
                const storedUser = getUser();

                if (storedToken && !isTokenExpired(storedToken) && storedUser) {
                    setTokenState(storedToken);
                    setUser(storedUser);
                    setIsAuthenticated(true);
                } else {
                    clearAuthData();
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                clearAuthData();
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = useCallback(async (email, password) => {
        const result = await loginUser(email, password);

        if (result.success && result.data) {
            const { token: newToken, user: newUser } = result.data;

            if (newToken && newUser) {
                setTokenState(newToken);
                setUser(newUser);
                setIsAuthenticated(true);
            }

            return result.data;
        } else {
            throw new Error(result.error || 'Login failed');
        }
    }, []);

    // Logout function
    const logout = useCallback(async () => {
        await logoutUser();
        setTokenState(null);
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    // Check if user is admin
    const isAdmin = useCallback(() => {
        return user?.role === 'Admin';
    }, [user]);

    // Update user data
    const updateUser = useCallback((userData) => {
        setUser(userData);
        setStoredUser(userData);
    }, []);

    const value = {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        logout,
        isAdmin,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;