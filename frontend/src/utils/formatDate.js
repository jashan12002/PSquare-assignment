
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


export const getDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  if (start === end) {
    return start;
  }
  
  return `${start} - ${end}`;
};


export const formatShortDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  const year = dateObj.getFullYear().toString().substring(2);
  
  return `${month}/${day}/${year}`;
};


export const getMonthAndYear = (date) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${months[date.getMonth()]}, ${date.getFullYear()}`;
};


export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};


export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};


export const isDateInRange = (date, startDate, endDate) => {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  return checkDate >= start && checkDate <= end;
}; 