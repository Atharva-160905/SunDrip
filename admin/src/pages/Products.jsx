import { useState, useEffect, useMemo } from 'react';
import { Edit3, Trash2, Plus, Search, Layers } from 'lucide-react';
import api from '../utils/api';
import AdminProductModal, { PRODUCT_CATEGORIES } from '../components/AdminProductModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?all=true&pageSize=100');
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      const productId = editingProduct?._id || editingProduct?.id;
      if (editingProduct && productId) {
        await api.put(`/products/${productId}`, productData);
      } else {
        await api.post('/products', productData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Save product error:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to save product';
      alert(`Failed to save product: ${msg}`);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error(error);
        alert('Failed to delete product');
      }
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div style={{ padding: '40px', color: '#71717a', fontSize: '14px' }}>
        Loading catalog inventory...
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Products</h1>
          <p>Manage inventory across T-Shirts, Joggers, Gym Wear, and Merch.</p>
        </div>
        <button onClick={openCreateModal} className="admin-btn-primary">
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Control Bar: Category Filters & Search */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          backgroundColor: '#111216',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #1f2128',
        }}
      >
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {['All', ...PRODUCT_CATEGORIES].map((cat) => {
            const count =
              cat === 'All'
                ? products.length
                : products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #2e313d' : '1px solid transparent',
                  backgroundColor: isSelected ? '#1e2029' : 'transparent',
                  color: isSelected ? '#ffffff' : '#8e94a0',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{cat}</span>
                <span
                  style={{
                    backgroundColor: isSelected ? '#2d303d' : '#181920',
                    color: isSelected ? '#ffffff' : '#71717a',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    padding: '1px 6px',
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div style={{ position: 'relative', minWidth: '220px', flex: '1', maxWidth: '300px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#71717a',
            }}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-form-control"
            style={{ paddingLeft: '34px', height: '36px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Catalog Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Inventory</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id}>
                <td>
                  <img
                    src={p.images?.[0] || '/placeholder.png'}
                    alt={p.name}
                    style={{
                      width: '38px',
                      height: '48px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      backgroundColor: '#16171f',
                      border: '1px solid #232530',
                    }}
                  />
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '13.5px' }}>{p.name}</div>
                  <div style={{ fontSize: '11.5px', color: '#71717a', marginTop: '2px' }}>
                    {p.sizes?.length ? `${p.sizes.length} sizes configured` : 'Standard sizing'}
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: '#f4f4f5', fontSize: '13.5px' }}>₹{p.price}</td>
                <td>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: '#1a1b22',
                      color: '#a1a1aa',
                      border: '1px solid #282933',
                    }}
                  >
                    {p.category}
                  </span>
                </td>
                <td style={{ color: p.stock > 0 ? '#34d399' : '#f87171', fontWeight: 600, fontSize: '13px' }}>
                  {p.stock} units
                </td>
                <td>
                  <span className={`admin-badge ${p.isActive ? 'active' : 'inactive'}`}>
                    {p.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => openEditModal(p)}
                      className="admin-btn-outline"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px',
                        width: '30px',
                        height: '30px',
                      }}
                      title="Edit Product"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="admin-btn-danger"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px',
                        width: '30px',
                        height: '30px',
                      }}
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '48px 24px', color: '#71717a' }}>
                  <Layers size={28} style={{ margin: '0 auto 10px', color: '#3f3f46' }} />
                  <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa' }}>
                    {products.length === 0
                      ? 'No products found. Click "Add Product" to create one.'
                      : 'No products match the selected category filter or search query.'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default Products;
