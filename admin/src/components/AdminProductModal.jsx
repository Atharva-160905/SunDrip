import { useState, useEffect } from 'react';
import { X, UploadCloud } from 'lucide-react';
import api from '../utils/api';

export const PRODUCT_CATEGORIES = ['T-Shirts', 'Joggers', 'Gym Wear', 'Merch'];

const normalizeCategory = (cat) => {
  if (!cat) return '';
  const trimmed = cat.trim();
  const match = PRODUCT_CATEGORIES.find(c => c.toLowerCase() === trimmed.toLowerCase());
  if (match) return match;
  
  // Legacy category fallback mapping
  const legacyMap = {
    'tshirts': 'T-Shirts',
    't-shirts': 'T-Shirts',
    'sleeveless': 'Gym Wear',
    'shorts': 'Joggers',
    'combos': 'Merch',
  };
  return legacyMap[trimmed.toLowerCase()] || trimmed;
};

const formatSizes = (sizes) => {
  if (!sizes) return '';
  if (Array.isArray(sizes)) {
    return sizes
      .map((s) => (typeof s === 'string' ? s : s?.size || ''))
      .filter(Boolean)
      .join(', ');
  }
  return String(sizes);
};

const AdminProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    images: '',
    category: '',
    stock: 0,
    sizes: '',
    isTrending: false,
    isActive: true,
  });

  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price !== undefined ? product.price : 0,
        description: product.description || '',
        images: Array.isArray(product.images)
          ? product.images.join(', ')
          : product.images || '',
        category: normalizeCategory(product.category),
        stock: product.stock !== undefined ? product.stock : 0,
        sizes: formatSizes(product.sizes),
        isTrending: Boolean(product.isTrending),
        isActive: product.isActive !== undefined ? Boolean(product.isActive) : true,
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        description: '',
        images: '',
        category: '',
        stock: 0,
        sizes: 'S, M, L, XL',
        isTrending: false,
        isActive: true,
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleFilesUpload = async (filesList) => {
    const files = Array.from(filesList);
    if (!files.length) return;
    
    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const uploadData = new FormData();
      uploadData.append('image', file);
      try {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
        const { data } = await api.post('/upload', uploadData, config);
        if (data && data.url) {
          uploadedUrls.push(data.url);
        }
      } catch (error) {
        console.error('File upload error for', file.name, error);
        alert(`Failed to upload ${file.name}.`);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData(prev => {
        const currentImages = prev.images ? prev.images.split(',').map(s => s.trim()).filter(Boolean) : [];
        const combined = [...currentImages, ...uploadedUrls];
        return {
          ...prev,
          images: combined.join(', ')
        };
      });
    }
    setUploading(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => {
      const imagesList = prev.images.split(',').map(s => s.trim()).filter(Boolean);
      const updated = imagesList.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated.join(', ')
      };
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
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
    
    const parsedData = {
      name: formData.name.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      description: formData.description.trim(),
      images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
      sizes: formData.sizes
        ? formData.sizes
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .map(size => ({ size, stock: Number(formData.stock) || 0 }))
        : [],
      isTrending: Boolean(formData.isTrending),
      isActive: Boolean(formData.isActive),
    };
    
    onSave(parsedData);
  };

  const currentImagesList = formData.images
    ? formData.images.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <div className="admin-modal-header">
          <h2>
            {product ? 'Edit Product' : 'New Product'}
          </h2>
          <button className="admin-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body" style={{ maxHeight: 'calc(85vh - 130px)', overflowY: 'auto' }}>
            <div className="admin-form-group">
              <label>Product Title</label>
              <input 
                required 
                type="text" 
                name="name" 
                className="admin-form-control" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g. Iron Forge Heavyweight Oversized Tee" 
              />
            </div>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Price (₹)</label>
                <input 
                  required 
                  type="number" 
                  name="price" 
                  className="admin-form-control" 
                  value={formData.price} 
                  onChange={handleChange} 
                  min="0" 
                />
              </div>
              <div className="admin-form-group">
                <label>Inventory Units</label>
                <input 
                  required 
                  type="number" 
                  name="stock" 
                  className="admin-form-control" 
                  value={formData.stock} 
                  onChange={handleChange} 
                  min="0" 
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Category</label>
                <select 
                  required 
                  name="category" 
                  className="admin-form-control" 
                  value={formData.category} 
                  onChange={handleChange}
                >
                  <option value="" disabled>Select category</option>
                  {PRODUCT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  {formData.category && !PRODUCT_CATEGORIES.includes(formData.category) && (
                    <option value={formData.category}>{formData.category} (Legacy)</option>
                  )}
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Sizes (comma separated)</label>
              <input 
                required 
                type="text" 
                name="sizes" 
                className="admin-form-control" 
                value={formData.sizes} 
                onChange={handleChange} 
                placeholder="e.g. S, M, L, XL, XXL" 
              />
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea 
                required 
                name="description" 
                rows="3" 
                className="admin-form-control" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Fabric composition, weight, cut and fit specifications..."
              />
            </div>

            {/* Image Uploader with Dropzone & Previews */}
            <div className="admin-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ margin: 0 }}>Images ({currentImagesList.length})</label>
                <span style={{ fontSize: '11px', color: '#71717a' }}>Any dimensions accepted</span>
              </div>

              {/* Drag & Drop Zone */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: isDragging ? '1px dashed #ffffff' : '1px dashed #2e303d',
                  backgroundColor: isDragging ? '#181a24' : '#14151c',
                  borderRadius: '6px',
                  padding: '16px 12px',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                  marginBottom: '8px'
                }}
              >
                <UploadCloud size={22} style={{ margin: '0 auto 6px', color: isDragging ? '#ffffff' : '#71717a' }} />
                <p style={{ margin: 0, fontSize: '12.5px', color: '#d4d4d8', fontWeight: 500 }}>
                  Drag & drop image(s) here, or{' '}
                  <label style={{ color: '#ffffff', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>
                    browse files
                    <input 
                      type="file" 
                      multiple 
                      onChange={(e) => handleFilesUpload(e.target.files)} 
                      style={{ display: 'none' }} 
                      accept="image/*,.avif,.webp,.png,.jpg,.jpeg" 
                      disabled={uploading} 
                    />
                  </label>
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#71717a' }}>
                  Supports JPG, PNG, WEBP, AVIF
                </p>
                {uploading && (
                  <div style={{ marginTop: '6px', fontSize: '12px', color: '#38bdf8', fontWeight: 600 }}>
                    Uploading images... please wait
                  </div>
                )}
              </div>

              {/* Raw URLs input */}
              <input 
                required 
                type="text" 
                name="images" 
                className="admin-form-control" 
                value={formData.images} 
                onChange={handleChange} 
                placeholder="Comma separated image URLs, e.g. /categories/tshirts.png, https://..." 
                style={{ fontSize: '12px' }}
              />

              {/* Live Image Previews Grid */}
              {currentImagesList.length > 0 && (
                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
                    gap: '8px', 
                    marginTop: '10px',
                    padding: '8px',
                    backgroundColor: '#0c0d11',
                    borderRadius: '6px',
                    border: '1px solid #1f2129'
                  }}
                >
                  {currentImagesList.map((url, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        position: 'relative', 
                        borderRadius: '4px', 
                        overflow: 'hidden', 
                        border: '1px solid #282a35', 
                        backgroundColor: '#16171f', 
                        aspectRatio: '3/4' 
                      }}
                    >
                      <img 
                        src={url} 
                        alt={`Preview ${idx + 1}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                      />
                      {idx === 0 && (
                        <span 
                          style={{ 
                            position: 'absolute', 
                            bottom: '3px', 
                            left: '3px', 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            color: '#ffffff', 
                            fontSize: '9px', 
                            fontWeight: 700, 
                            padding: '1px 4px', 
                            borderRadius: '2px', 
                            letterSpacing: '0.5px' 
                          }}
                        >
                          COVER
                        </span>
                      )}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImage(idx)}
                        style={{ 
                          position: 'absolute', 
                          top: '3px', 
                          right: '3px', 
                          backgroundColor: 'rgba(0, 0, 0, 0.75)', 
                          color: '#f87171', 
                          border: 'none', 
                          borderRadius: '9999px', 
                          width: '18px', 
                          height: '18px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          cursor: 'pointer', 
                          padding: 0 
                        }}
                        title="Remove image"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-form-row" style={{ marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#d4d4d8' }}>
                <input 
                  type="checkbox" 
                  name="isTrending" 
                  checked={formData.isTrending} 
                  onChange={handleChange} 
                  style={{ width: '15px', height: '15px', accentColor: '#ffffff' }} 
                />
                <span style={{ fontWeight: 500, fontSize: '12.5px' }}>Trending Product</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#d4d4d8' }}>
                <input 
                  type="checkbox" 
                  name="isActive" 
                  checked={formData.isActive} 
                  onChange={handleChange} 
                  style={{ width: '15px', height: '15px', accentColor: '#ffffff' }} 
                />
                <span style={{ fontWeight: 500, fontSize: '12.5px' }}>Storefront Visible</span>
              </label>
            </div>
          </div>
          
          <div className="admin-modal-footer">
            <button type="button" className="admin-btn-outline" onClick={onClose} disabled={uploading}>
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary" disabled={uploading}>
              {product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductModal;
