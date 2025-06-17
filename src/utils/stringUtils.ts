export const decodeHTML = (html: string): string => {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&euro;': '€',
    '&pound;': '£',
    '&cent;': '¢',
  };

  return html.replace(/&[^;]+;/g, (entity) => {
    return entities[entity] || entity;
  });
}; 