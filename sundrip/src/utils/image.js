/**
 * Resolves product image URLs cleanly for both local development and Vercel cloud deployment.
 * Converts any hardcoded localhost URLs to relative static asset paths (/uploads/...)
 * ensuring images load over HTTPS with zero Mixed Content blocks.
 */
export const resolveImageUrl = (url) => {
  if (!url) return '/placeholder.png';
  
  if (typeof url !== 'string') return url;

  // If URL contains localhost:5000/uploads, convert to /uploads/filename
  if (url.includes('localhost:5000/uploads/')) {
    const filename = url.split('/uploads/')[1];
    return `/uploads/${filename}`;
  }

  // If it's any http://localhost URL
  if (url.startsWith('http://localhost:5000/')) {
    return url.replace('http://localhost:5000/', '/');
  }

  return url;
};

export default resolveImageUrl;

