export const resolveImageUrl = (url) => {
  if (!url) return '/placeholder.png';
  
  if (typeof url !== 'string') return url;

  if (url.includes('localhost:5000/uploads/')) {
    const filename = url.split('/uploads/')[1];
    return `/uploads/${filename}`;
  }

  if (url.startsWith('http://localhost:5000/')) {
    return url.replace('http://localhost:5000/', '/');
  }

  return url;
};

export default resolveImageUrl;

