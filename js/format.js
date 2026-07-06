/**
 * Formats a number to always have two digits (e.g., 9 -> "09")
 * @param {number} num
 * @returns {string}
 */
export const padZero = (num) => num.toString().padStart(2, '0');

/**
 * Returns the AM/PM string and the 12-hour formatted hours
 * @param {number} hours (0-23)
 * @returns {Object} { formattedHours: number, period: string }
 */
export const format12Hour = (hours) => {
    const period = hours >= 12 ? 'PM' : 'AM';
    let formattedHours = hours % 12;
    // Handle midnight (0 hours) as 12
    formattedHours = formattedHours ? formattedHours : 12;
    return { formattedHours, period };
};

/**
 * Formats a Date object into a readable string like "Monday, 06 July 2026"
 * @param {Date} date
 * @returns {Object} { weekday, fullDate }
 */
export const formatDate = (date) => {
    const weekdayOptions = { weekday: 'long' };
    const dateOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    
    // Using default locale (user's system)
    const weekday = date.toLocaleDateString(undefined, weekdayOptions);
    const fullDate = date.toLocaleDateString(undefined, dateOptions);
    
    return { weekday, fullDate };
};
