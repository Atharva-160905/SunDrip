import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure local uploads directory exists for resilient local fallback
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Use memory storage to allow Cloudinary upload with automatic disk fallback
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow all common web image formats (avif, webp, jpg, jpeg, png, gif, svg)
  const allowedExtensions = /\.(jpeg|jpg|png|webp|avif|gif|svg)$/i;
  const isImageMime = file.mimetype.startsWith('image/');
  const hasImageExt = allowedExtensions.test(file.originalname);

  if (isImageMime || hasImageExt) {
    return cb(null, true);
  }
  cb(new Error('Only image files (JPG, PNG, WEBP, AVIF, GIF, SVG) are allowed.'));
};

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit - never blocks high-res images
  fileFilter,
});

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const hasCloudinary = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  // Attempt Cloudinary upload if credentials exist
  if (hasCloudinary) {
    try {
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'sundrip-products',
            resource_type: 'image',
            transformation: [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      // Await Cloudinary upload directly
      const result = await uploadPromise;

      if (result && (result.secure_url || result.url)) {
        return res.json({
          url: result.secure_url || result.url,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    } catch (cloudErr) {
      console.warn('Cloudinary upload unavailable or failed, smoothly saving to local /uploads storage:', cloudErr.message);
    }
  }

  // Resilient fallback: save locally to backend/uploads
  try {
    const ext = path.extname(req.file.originalname) || '.jpg';
    const cleanBase = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${cleanBase}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, req.file.buffer);

    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';
    const localUrl = `${protocol}://${host}/uploads/${filename}`;

    return res.json({
      url: localUrl,
      fallback: true,
      filename,
    });
  } catch (fsErr) {
    console.error('Local file write error:', fsErr);
    return res.status(500).json({ message: 'Failed to process image upload' });
  }
});

export default router;
