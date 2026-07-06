export const storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`timesuite_${key}`);
            return item !== null ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Error reading from localStorage', error);
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(`timesuite_${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn('Error writing to localStorage', error);
            return false;
        }
    }
};
