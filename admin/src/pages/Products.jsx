import { useState, useEffect } from 'react';
import { Edit3, Trash2, Plus } from 'lucide-react';
import api from '../utils/api';
import AdminProductModal from '../components/AdminProductModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?all=true&pageSize=100');
      setProducts(data.products);
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
      if (editingProduct) {
        // Update existing
        await api.put(`/products/${editingProduct._id}`, productData);
      } else {
        // Create new
        await api.post('/products', productData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert('Failed to save product');
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

  if (loading) return <h2>Loading products...</h2>;

  return (
    <div>
      <div className="admin-header">
        <h1>Products Management</h1>
        <button onClick={openCreateModal} className="admin-btn-primary">
          <Plus size={18} /> Create New Product
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img src={p.images[0] || '/placeholder.png'} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ fontWeight: 500, color: '#0f172a' }}>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.category}</td>
                <td style={{ color: p.stock > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>{p.stock}</td>
                <td>
                  <span className={`admin-badge ${p.isActive ? 'active' : 'inactive'}`}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEditModal(p)} className="admin-btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', width: '32px', height: '32px' }} title="Edit">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => deleteProduct(p._id)} className="admin-btn-danger" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', width: '32px', height: '32px' }} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No products found. Start by creating one!</td>
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
