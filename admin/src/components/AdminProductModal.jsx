import { useState, useEffect } from 'react';
import { X, UploadCloud } from 'lucide-react';
import api from '../utils/api';

const AdminProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    images: '',
    category: '',
    stock: 0,
    colors: '',
    sizes: '',
    isTrending: false,
    isActive: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || 0,
        description: product.description || '',
        images: product.images ? product.images.join(', ') : '',
        category: product.category || '',
        stock: product.stock || 0,
        colors: product.colors ? product.colors.join(', ') : '',
        sizes: product.sizes ? product.sizes.map(s => s.size).join(', ') : '',
        isTrending: product.isTrending || false,
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        description: '',
        images: '',
        category: '',
        stock: 0,
        colors: '',
        sizes: '',
        isTrending: false,
        isActive: true,
      });
    }
  }, [product, isOpen]);

  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const uploadData = new FormData();
    uploadData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      
      const { data } = await api.post('/upload', uploadData, config);
      
      // Assume the backend is running on http://localhost:5000 
      // The API base URL is usually http://localhost:5000/api
      // data.url contains the relative path e.g. /uploads/image-xxx.jpg
      const imageUrl = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${data.url}`;
      
      setFormData(prev => ({
        ...prev,
        images: prev.images ? `${prev.images}, ${imageUrl}` : imageUrl
      }));
    } catch (error) {
      console.error(error);
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse comma separated strings into arrays
    const parsedData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: formData.images.split(',').map(s => s.trim()).filter(s => s),
      colors: formData.colors.split(',').map(s => s.trim()).filter(s => s),
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s).map(size => ({ size })) : [],
    };
    
    onSave(parsedData);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <div className="admin-modal-header">
          <h2>{product ? 'Edit Product' : 'Create New Product'}</h2>
          <button className="admin-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="admin-form-group">
              <label>Name</label>
              <input required type="text" name="name" className="admin-form-control" value={formData.name} onChange={handleChange} placeholder="e.g. Classic T-Shirt" />
            </div>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Price (₹)</label>
                <input required type="number" name="price" className="admin-form-control" value={formData.price} onChange={handleChange} min="0" />
              </div>
              <div className="admin-form-group">
                <label>Stock</label>
                <input required type="number" name="stock" className="admin-form-control" value={formData.stock} onChange={handleChange} min="0" />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Category</label>
                <select required name="category" className="admin-form-control" value={formData.category} onChange={handleChange}>
                  <option value="" disabled>Select category</option>
                  <option value="tshirts">T-Shirts</option>
                  <option value="sleeveless">Sleeveless</option>
                  <option value="shorts">Shorts</option>
                  <option value="combos">Combos</option>
                </select>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Sizes (comma separated)</label>
                <input required type="text" name="sizes" className="admin-form-control" value={formData.sizes} onChange={handleChange} placeholder="e.g. S, M, L, XL" />
              </div>
              <div className="admin-form-group">
                <label>Colors (comma separated)</label>
                <input type="text" name="colors" className="admin-form-control" value={formData.colors} onChange={handleChange} placeholder="e.g. Black, White, Red" />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea required name="description" rows="3" className="admin-form-control" value={formData.description} onChange={handleChange} placeholder="Product details..."></textarea>
            </div>

            <div className="admin-form-group">
              <label>Product Images (Upload or URL)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input required type="text" name="images" className="admin-form-control" value={formData.images} onChange={handleChange} placeholder="e.g. /images/shirt1.jpg, /images/shirt2.jpg" style={{ flex: 1 }} />
                <label className="admin-btn-outline" style={{ cursor: uploading ? 'not-allowed' : 'pointer', margin: 0, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UploadCloud size={16} />
                  {uploading ? '...' : 'Upload'}
                  <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="admin-form-row" style={{ marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} />
                <span style={{ fontWeight: 500 }}>Is Trending</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                <span style={{ fontWeight: 500 }}>Is Active (Visible)</span>
              </label>
            </div>
          </div>
          
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn-primary">
              {product ? 'Update Details' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductModal;
