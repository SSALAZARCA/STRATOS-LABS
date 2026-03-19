import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Mail, User, Loader2, CheckCircle } from 'lucide-react';
import { createOrder } from '../services/api';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const { cart, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Order via API Service
            await createOrder({
                customer_email: formData.email,
                total: subtotal,
                items: cart,
                status: 'completed' // In real life, wait for webhook
            });

            // 2. Clear Cart and Show Success
            setIsSuccess(true);
            clearCart();
            setTimeout(() => {
                navigate('/');
            }, 5000);

        } catch (error) {
            console.error('Checkout error:', error.message);
            alert('Hubo un problema procesando tu orden. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="checkout-page" style={{ paddingTop: '150px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px' }}>
                    <CheckCircle size={80} color="#00ff00" style={{ marginBottom: '2rem' }} />
                    <h1 className="gradient-text">¡Pago Exitoso!</h1>
                    <p style={{ fontSize: '1.2rem', margin: '1.5rem 0' }}>Hemos recibido tu pedido. Los detalles de descarga han sido enviados a <strong>{formData.email}</strong>.</p>
                    <p style={{ opacity: 0.6 }}>Redirigiendo al inicio en unos segundos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page" style={{ paddingTop: '150px', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                    {/* Form Side */}
                    <div>
                        <h2 style={{ marginBottom: '2rem' }}>Información de Facturación</h2>
                        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2.5rem' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Nombre Completo</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', opacity: 0.5 }} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: '#fff' }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Correo Electrónico</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', opacity: 0.5 }} />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: '#fff' }}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CreditCard size={20} color="var(--primary)" /> Método de Pago
                                </h3>
                                <div className="glass-card" style={{ padding: '1rem', background: 'rgba(0, 242, 255, 0.05)', border: '1px solid var(--primary)' }}>
                                    <span style={{ fontWeight: 600 }}>PayPal / PSE / Tarjeta</span>
                                    <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.2rem' }}>Serás redirigido a la pasarela segura.</p>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', height: '55px' }}
                                disabled={loading || cart.length === 0}
                            >
                                {loading ? <Loader2 className="spin" /> : "Finalizar Compra"}
                            </button>
                            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.5, fontSize: '0.8rem' }}>
                                <ShieldCheck size={16} /> Pago 100% Seguro y Encriptado
                            </div>
                        </form>
                    </div>

                    {/* Summary Side */}
                    <div>
                        <h2 style={{ marginBottom: '2rem' }}>Resumen de Orden</h2>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '2rem' }}>
                                {cart.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Qty: {item.quantity}</div>
                                        </div>
                                        <div style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ borderTop: '2px solid var(--primary)', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900 }}>
                                    <span>Total</span>
                                    <span className="gradient-text">${subtotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
