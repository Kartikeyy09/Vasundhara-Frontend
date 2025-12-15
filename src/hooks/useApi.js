import { useState, useCallback } from 'react';
import apiService from '../services/api';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const execute = useCallback(async (apiCall) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiCall();
            setData(response);
            return { success: true, data: response };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const get = useCallback((endpoint, requireAuth = true) => {
        return execute(() => apiService.get(endpoint, requireAuth));
    }, [execute]);

    const post = useCallback((endpoint, data, requireAuth = true, isFormData = false) => {
        return execute(() => apiService.post(endpoint, data, requireAuth, isFormData));
    }, [execute]);

    const put = useCallback((endpoint, data, requireAuth = true, isFormData = false) => {
        return execute(() => apiService.put(endpoint, data, requireAuth, isFormData));
    }, [execute]);

    const patch = useCallback((endpoint, data, requireAuth = true, isFormData = false) => {
        return execute(() => apiService.patch(endpoint, data, requireAuth, isFormData));
    }, [execute]);

    const del = useCallback((endpoint, requireAuth = true) => {
        return execute(() => apiService.delete(endpoint, requireAuth));
    }, [execute]);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    return {
        loading,
        error,
        data,
        get,
        post,
        put,
        patch,
        delete: del,
        reset,
    };
};

export default useApi;