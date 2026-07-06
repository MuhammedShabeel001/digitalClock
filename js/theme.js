const THEME_KEY = 'digital-clock-theme';

/**
 * Toggles the theme between light and dark
 * @returns {string} The new theme
 */
export const toggleTheme = () => {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    
    return newTheme;
};

/**
 * Initializes the theme based on local storage or system preference
 * @returns {string} The initial theme
 */
export const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const htmlElement = document.documentElement;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        return savedTheme;
    }
    
    // Default is dark as requested, but we can check system preference
    // if we wanted. For now, defaulting to dark.
    htmlElement.setAttribute('data-theme', 'dark');
    return 'dark';
};
