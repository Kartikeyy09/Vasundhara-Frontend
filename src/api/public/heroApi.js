// src/api/public/heroApi.js
import { API_BASE_URL, ENDPOINTS, IMAGES } from '../../utils/constants';

const toMs = (val, fallback = 3000) => {
    const n = Number(val);
    if (!Number.isFinite(n) || n <= 0) return fallback;
    return n <= 30 ? n * 1000 : n;
};

export const getHeroSlides = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.HERO.LIST}`, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `HTTP ${res.status}`);
        }
        const data = await res.json();
        const slides = (Array.isArray(data) ? data : [])
            .slice()
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((s) => ({
                ...s,
                computedImageUrl: IMAGES.url(s.imageUrl),
                durationMs: toMs(s.duration, 3000),
                autoplay: Boolean(s.autoplay),
            }));
        return { success: true, data: slides };
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        return { success: false, error: error.message };
    }
};

export const getHeroSlideById = async (id) => {
    try {
        const res = await fetch(`${API_BASE_URL}${ENDPOINTS.HOME_ROUTES.HERO.DETAIL(id)}`, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `HTTP ${res.status}`);
        }
        const s = await res.json();
        return {
            success: true,
            data: {
                ...s,
                computedImageUrl: IMAGES.url(s.imageUrl),
                durationMs: toMs(s.duration, 3000),
                autoplay: Boolean(s.autoplay),
            },
        };
    } catch (error) {
        console.error('Error fetching hero slide:', error);
        return { success: false, error: error.message };
    }
};

export default {
    getAll: getHeroSlides,
    getById: getHeroSlideById,
};