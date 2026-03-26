import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Cloudinary auto-configures from CLOUDINARY_URL env variable
// Use Cloudinary as storage backend
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'sundrip-products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit', quality: 'auto' }],
  }),
});

const upload = multer({ storage });

router.post('/', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ message: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('Upload success:', req.file.path);
    res.send({ url: req.file.path });
  });
});

export default router;

