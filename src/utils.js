export const unifyDate = dateString => {
  const formatted = dateString.replace('Year ', 'Y').replace(' Day ', 'D').replace(',', '');
  const segments = formatted.split(' ')
  if (segments[1].length < 5) {
    return `${segments[0]} 0${segments[1]}`
  }
  return formatted;
};

export const numberFormat = new Intl.NumberFormat();
