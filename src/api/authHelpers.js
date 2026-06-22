/**
 * Safely parse the stored user object from localStorage.
 * Old login code stored JSON.stringify(undefined) = the literal string
 * "undefined", which makes JSON.parse throw. This helper handles that case,
 * any other invalid JSON, and missing keys — returning null in all bad cases
 * so the app treats the session as logged-out.
 */
export function getStoredUser() {
    try {
        const str = localStorage.getItem('user');
        if (!str || str === 'undefined' || str === 'null') {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return null;
        }
        return JSON.parse(str);
    } catch (_) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
    }
}

/**
 * Check whether a valid auth token exists in localStorage.
 */
export function hasValidToken() {
    const token = localStorage.getItem('token');
    return Boolean(token && token !== 'undefined' && token !== 'null');
}

/**
 * Clear all auth-related localStorage keys.
 */
export function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}
