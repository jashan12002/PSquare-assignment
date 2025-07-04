/**
 * Format date to a readable string
 * @param {string|Date} date - The date to format
 * @param {boolean} includeTime - Whether to include time in the output
 * @returns {string} Formatted date string
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Get date range as a string
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {string} Formatted date range
 */
export const getDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  if (start === end) {
    return start;
  }
  
  return `${start} - ${end}`;
};

/**
 * Format date to MM/DD/YY
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatShortDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString().substring(2);
  
  return `${month}/${day}/${year}`;
};

/**
 * Get the month name and year
 * @param {Date} date - The date to get month and year from
 * @returns {string} Month name and year
 */
export const getMonthAndYear = (date) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${months[date.getMonth()]}, ${date.getFullYear()}`;
};

/**
 * Get the number of days in a month
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {number} Number of days in the month
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {number} First day of the month
 */
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

/**
 * Check if a date is between two dates
 * @param {Date} date - The date to check
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {boolean} True if date is between start and end dates
 */
export const isDateInRange = (date, startDate, endDate) => {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  return checkDate >= start && checkDate <= end;
}; 