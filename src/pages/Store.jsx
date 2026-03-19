import React, { useState, useEffect } from 'react';
import { ShoppingCart, ShoppingBag, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getActiveProducts } from '../services/api';
import { useCart } from '../context/CartContext';

const Store = () => {
    const navigate = useNavigate();
    const { cart, addToCart, removeFromCart, subtotal } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getActiveProducts();
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="store-page" style={{ paddingTop: '120px', minHeight: '100vh' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span className="hero-tagline">Tienda 3D</span>
                    <h1 style={{ fontSize: '3rem' }}>Modelos Digitales <span className="gradient-text">Premium</span></h1>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                        <Loader2 className="spin" size={48} color="var(--primary)" />
                    </div>
                ) : (
                    <div className="store-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                        {products.length > 0 ? products.map(model => (
                            <div key={model.id} className="product-card glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '220px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <img src={model.image_url} alt={model.name} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                                </div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 600 }}>{model.category}</span>
                                <h3 style={{ margin: '0.5rem 0' }}>{model.name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>${model.price}</span>
                                    <button
                                        onClick={() => {
                                            addToCart(model);
                                            setIsCartOpen(true);
                                        }}
                                        className="btn btn-primary"
                                        style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
                                    >
                                        <ShoppingBag size={16} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> Añadir
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', opacity: 0.5 }}>
                                No hay modelos disponibles en este momento.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Cart Button */}
            <div
                onClick={() => setIsCartOpen(true)}
                style={{
                    position: 'fixed', bottom: '2rem', right: '2rem', width: '65px', height: '65px',
                    background: 'var(--primary)', color: '#000', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0, 242, 255, 0.4)', zIndex: 2000
                }}
            >
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                    <div style={{
                        position: 'absolute', top: 0, right: 0, background: 'var(--secondary)', color: '#fff',
                        width: '24px', height: '24px', borderRadius: '50%', fontSize: '0.8rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-deep)'
                    }}>{cart.length}</div>
                )}
            </div>

            {/* Cart Drawer */}
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`} style={{
                position: 'fixed', top: 0, right: isCartOpen ? 0 : '-100%', width: '100%', maxWidth: '400px',
                height: '100vh', background: 'var(--bg-surface)', backdropFilter: 'blur(20px)',
                borderLeft: '1px solid var(--glass-border)', zIndex: 3000, padding: '2.5rem',
                transition: 'right 0.5s cubic-bezier(0.77, 0, 0.175, 1)', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3>Tu Carrito</h3>
                    <span onClick={() => setIsCartOpen(false)} style={{ cursor: 'pointer', fontSize: '2rem' }}>&times;</span>
                </div>
                <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                    {cart.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>{item.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                    {item.quantity} x ${item.price}
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '0.8rem' }}
                            >Eliminar</button>
                        </div>
                    ))}
                    {cart.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                            Tu carrito está vacío.
                        </div>
                    )}
                </div>
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                        <span>Total</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={cart.length === 0}
                        onClick={() => navigate('/checkout')}
                    >
                        Proceder al Pago
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Store;
