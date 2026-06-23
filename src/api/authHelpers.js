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

export function hasValidToken() {
    const token = localStorage.getItem('token');
    return Boolean(token && token !== 'undefined' && token !== 'null');
}

export function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}
