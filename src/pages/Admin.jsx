import React, { useState, useEffect } from 'react';
import {
    Lock, LayoutDashboard, Package, CreditCard,
    BarChart3, Users, Settings, LogOut, Plus,
    TrendingUp, DollarSign, ShoppingCart, ArrowUpRight,
    Search, Filter, MoreVertical, Download, Cpu
} from 'lucide-react';
import * as api from '../services/api';

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ totalSales: 0, ordersCount: 0, customersCount: 0 });
    const [products, setProducts] = useState([]);
    const [rawOrders, setRawOrders] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            fetchAdminData();
        }
    }, [isLoggedIn, activeTab]);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            // Fetch Products
            if (activeTab === 'store' || activeTab === 'dashboard') {
                const prodData = await api.getAllProducts();
                setProducts(prodData || []);
            }

            // Fetch Stats
            const ordData = await api.getOrderStats();
            const fullOrders = await api.getOrders();
            const contData = await api.getContacts();

            setRawOrders(fullOrders || []);
            setContacts(contData || []);

            const totalSales = ordData?.reduce((acc, curr) => acc + Number(curr.total), 0) || 0;
            setStats({
                totalSales,
                ordersCount: ordData?.length || 0,
                customersCount: fullOrders ? [...new Set(fullOrders.map(o => o.customer_email))].length : 0
            });

        } catch (error) {
            console.error('Error fetching admin data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        
        // Robust environment variable checking
        const getEnv = (val, fallback) => {
            if (!val || val === 'undefined' || val === '') return fallback;
            return val;
        };

        const adminUser = getEnv(import.meta.env.VITE_ADMIN_USER, 'santiago.salazar');
        const adminPass = getEnv(import.meta.env.VITE_ADMIN_PASSWORD, 'ssc841209');
        
        console.log('Login attempt...'); // Hidden verification
        
        if (username.trim() === adminUser && password.trim() === adminPass) {
            setIsLoggedIn(true);
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    };

    if (!isLoggedIn) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'radial-gradient(circle at center, #111 0%, #000 100%)' }}>
                <div className="glass-card" style={{ padding: '4rem', width: '100%', maxWidth: '450px', border: '1px solid var(--primary-glow)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div className="float-anim" style={{ width: '80px', height: '80px', background: 'var(--primary-glow)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '1px solid var(--primary)' }}>
                            <Lock size={32} color="var(--primary)" />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Acceso <span className="gradient-text">Stratos Admin</span></h2>
                        <p style={{ color: 'var(--text-dim)', marginTop: '1rem' }}>Identifíquese para gestionar la plataforma.</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <input
                                type="text"
                                placeholder="Usuario Administrador"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '15px', color: '#fff' }}
                            />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <input
                                type="password"
                                placeholder="Contraseña Maestra"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '15px', color: '#fff' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '60px' }}>Iniciar Sesión</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#020408', color: '#fff' }}>
            {/* Sidebar */}
            <aside style={{ width: '280px', background: 'rgba(10, 15, 25, 0.95)', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 100 }}>
                <div style={{ padding: '3rem 2rem' }}>
                    <div className="logo" style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '4rem' }}>
                        STRATOS <span className="gradient-text">ADMIN</span>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                        <SidebarItem icon={<Package size={20} />} label="Tienda 3D" active={activeTab === 'store'} onClick={() => setActiveTab('store')} />
                        <SidebarItem icon={<CreditCard size={20} />} label="Pagos" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
                        <SidebarItem icon={<BarChart3 size={20} />} label="Métricas" active={activeTab === 'metrics'} onClick={() => setActiveTab('metrics')} />
                        <SidebarItem icon={<Cpu size={20} />} label="Automatización" active={activeTab === 'automation'} onClick={() => setActiveTab('automation')} />
                        <SidebarItem icon={<Users size={20} />} label="Clientes" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
                    </nav>
                </div>

                <div style={{ marginTop: 'auto', padding: '2rem', borderTop: '1px solid var(--glass-border)' }}>
                    <button onClick={() => setIsLoggedIn(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
                        <LogOut size={18} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ marginLeft: '280px', flex: 1, padding: '4rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                        <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>Bienvenido de nuevo, Administrador.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div className="glass-card" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '12px' }}>
                            <div style={{ width: '10px', height: '10px', background: loading ? '#ffff00' : '#00ff00', borderRadius: '50%', boxShadow: loading ? '0 0 10px #ffff00' : '0 0 10px #00ff00' }}></div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{loading ? 'SINCRONIZANDO...' : 'SISTEMA ONLINE'}</span>
                        </div>
                    </div>
                </header>

                {activeTab === 'dashboard' && <DashboardModule stats={stats} products={products} />}
                {activeTab === 'store' && <StoreModule products={products} refresh={fetchAdminData} />}
                {activeTab === 'payments' && <PaymentsModule />}
                {activeTab === 'metrics' && <MetricsModule />}
                {activeTab === 'customers' && <CustomersModule orders={rawOrders} contacts={contacts} />}
                {activeTab === 'automation' && <AutomationModule />}
            </main>
        </div>
    );
};

// Sub-components for Modules
const SidebarItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        padding: '1.2rem 1.5rem',
        width: '100%',
        background: active ? 'var(--primary-glow)' : 'transparent',
        border: 'none',
        borderRadius: '12px',
        color: active ? 'var(--primary)' : 'var(--text-dim)',
        cursor: 'pointer',
        fontWeight: 700,
        transition: 'all 0.3s ease',
        borderLeft: active ? '4px solid var(--primary)' : '4px solid transparent'
    }}>
        {icon}
        {label}
    </button>
);

const DashboardModule = ({ stats, products }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
        <StatCard icon={<DollarSign size={24} />} label="Ingresos Totales" value={`$${stats.totalSales.toFixed(2)}`} trend="+15.2%" />
        <StatCard icon={<ShoppingCart size={24} />} label="Ventas Totales" value={stats.ordersCount} trend="+8.4%" />
        <StatCard icon={<Users size={24} />} label="Clientes Únicos" value={stats.customersCount} trend="+12.1%" />
        <StatCard icon={<Package size={24} />} label="Catálogo Activo" value={products.filter(p => p.status === 'active').length} trend="OK" />

        <div className="glass-card" style={{ gridColumn: 'span 4', padding: '2.5rem', marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}><TrendingUp size={20} color="var(--primary)" /> Actividad Reciente</h3>
            <p style={{ opacity: 0.6 }}>Panel de monitoreo en tiempo real sincronizado con Supabase.</p>
            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Top Productos</h4>
                    {products.slice(0, 3).map(p => (
                        <TopProduct key={p.id} name={p.name} sales={p.price} />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const StatCard = ({ icon, label, value, trend }) => (
    <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(0, 242, 255, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>{icon}</div>
        </div>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
        <div style={{ fontSize: '2rem', fontWeight: 900, marginTop: '0.5rem' }}>{value}</div>
    </div>
);

const TopProduct = ({ name, sales }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontWeight: 700 }}>{name}</span>
        <span style={{ color: 'var(--primary)', fontWeight: 800 }}>${sales}</span>
    </div>
);

const StoreModule = ({ products, refresh }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', price: '', category: '', description: '', image_url: '', model_url: '' });

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.createProduct(newItem);
            setIsModalOpen(false);
            setNewItem({ name: '', price: '', category: '', description: '', image_url: '', model_url: '' });
            refresh();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este producto?')) {
            try {
                await api.deleteProduct(id);
                refresh();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    return (
        <div style={{ display: 'grid', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 1.5rem', width: '400px' }}>
                    <Search size={18} color="var(--text-dim)" />
                    <input type="text" placeholder="Buscar modelos..." style={{ background: 'none', border: 'none', padding: '0.8rem', width: '100%', color: '#fff' }} />
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '0.8rem' }}><Plus size={18} /> Añadir Producto</button>
            </div>

            <div className="glass-card" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '2rem' }}>Producto</th>
                            <th>Estado</th>
                            <th>Precio</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <InventoryRow key={p.id} product={p} onDelete={handleDelete} />
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Nuevo Modelo 3D</h2>
                        <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1.2rem' }}>
                            <input placeholder="Nombre" required onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                            <input placeholder="Precio" type="number" step="0.01" required onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
                            <input placeholder="Categoría" required onChange={e => setNewItem({ ...newItem, category: e.target.value })} />
                            <textarea placeholder="Descripción" onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                            <input placeholder="URL Imagen (Directa)" required onChange={e => setNewItem({ ...newItem, image_url: e.target.value })} />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'none', border: '1px solid #fff', color: '#fff', borderRadius: '10px' }}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const InventoryRow = ({ product, onDelete }) => (
    <tr style={{ borderBottom: '1px solid var(--glass-border)', transition: '0.3s' }} className="hover-row">
        <td style={{ padding: '1.5rem 2rem', fontWeight: 700 }}>{product.name}</td>
        <td>
            <span style={{
                padding: '0.4rem 1rem',
                borderRadius: '50px',
                fontSize: '0.7rem',
                fontWeight: 800,
                background: product.status === 'active' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 255, 0, 0.1)',
                color: product.status === 'active' ? '#00ff00' : '#ffff00'
            }}>{product.status === 'active' ? 'Publicado' : 'Inactivo'}</span>
        </td>
        <td>${product.price}</td>
        <td>{product.category}</td>
        <td>
            <button
                onClick={() => onDelete(product.id)}
                style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}
            >
                Eliminar
            </button>
        </td>
    </tr>
);

const PaymentsModule = () => {
    const [settings, setSettings] = useState({});
    const [activeProvider, setActiveProvider] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPaymentSettings();
    }, []);

    const fetchPaymentSettings = async () => {
        try {
            const mapped = await api.getSettings();
            setSettings(mapped);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async (newKeys) => {
        setSaving(true);
        try {
            await api.updateSettingsBatch(newKeys);
            fetchPaymentSettings();
            setIsModalOpen(false);
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><CreditCard size={22} color="var(--primary)" /> Configuración de Pasarelas</h3>
                <p style={{ color: 'var(--text-dim)', marginTop: '1rem', marginBottom: '2.5rem' }}>Configure sus llaves de API para recibir pagos.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <PaymentProvider
                        name="PayPal"
                        status={settings.paypal_client_id ? "Conectado" : "Desconectado"}
                        onClick={() => { setActiveProvider('PayPal'); setIsModalOpen(true); }}
                    />
                    <PaymentProvider
                        name="Wompi (PSE/Bancolombia)"
                        status={settings.wompi_public_key ? "Conectado" : "Pendiente"}
                        onClick={() => { setActiveProvider('Wompi'); setIsModalOpen(true); }}
                    />
                    <PaymentProvider
                        name="Stripe"
                        status={settings.stripe_public_key ? "Conectado" : "Desconectado"}
                        onClick={() => { setActiveProvider('Stripe'); setIsModalOpen(true); }}
                    />
                </div>
            </div>

            <div className="glass-card" style={{ padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '2rem' }}>Transacciones Recientes</h3>
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <TransactionItem user="juan.perez@email.com" amount="$59.99" date="Hoy, 14:20" />
                    <TransactionItem user="marta.dev@tech.io" amount="$120.00" date="Ayer, 09:15" />
                    <TransactionItem user="alex_3d@studio.net" amount="$24.00" date="07 Mar, 21:44" />
                </div>
            </div>

            {isModalOpen && (
                <GatewayConfigModal
                    provider={activeProvider}
                    settings={settings}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    loading={saving}
                />
            )}
        </div>
    );
};

const GatewayConfigModal = ({ provider, settings, onClose, onSave, loading }) => {
    const [localKeys, setLocalKeys] = useState({});

    useEffect(() => {
        if (provider === 'PayPal') {
            setLocalKeys({ paypal_client_id: settings.paypal_client_id || '', paypal_secret: settings.paypal_secret || '' });
        } else if (provider === 'Wompi') {
            setLocalKeys({ wompi_public_key: settings.wompi_public_key || '', wompi_private_key: settings.wompi_private_key || '' });
        } else if (provider === 'Stripe') {
            setLocalKeys({ stripe_public_key: settings.stripe_public_key || '', stripe_secret_key: settings.stripe_secret_key || '' });
        }
    }, [provider, settings]);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
            <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '500px', border: '1px solid var(--primary-glow)' }}>
                <h2 style={{ marginBottom: '1rem' }}>Configurar {provider}</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>Ingrese sus credenciales de producción para activar este método de pago.</p>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {Object.keys(localKeys).map(key => (
                        <div key={key}>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 800 }}>{key.replace(/_/g, ' ').toUpperCase()}</label>
                            <input
                                type="text"
                                value={localKeys[key]}
                                onChange={e => setLocalKeys({ ...localKeys, [key]: e.target.value })}
                                style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#fff' }}
                            />
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                    <button onClick={() => onSave(localKeys)} disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>{loading ? 'Guardando...' : 'Guardar Llaves'}</button>
                    <button onClick={onClose} style={{ flex: 1, background: 'none', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '12px' }}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

const PaymentProvider = ({ name, status, onClick }) => (
    <div onClick={onClick} style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '16px',
        border: '1px solid var(--glass-border)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    }} className="hover-glow">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '50px', height: '50px', background: 'rgba(0,0,0,0.3)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '25px', height: '25px', background: 'var(--primary)', filter: 'blur(5px)', opacity: 0.3, borderRadius: '50%' }}></div>
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{
                fontSize: '0.75rem',
                fontWeight: 900,
                color: status === 'Conectado' ? '#00ff00' : (status === 'Pendiente' ? '#ffff00' : '#ff4444'),
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>{status}</span>
            <ChevronRight size={18} color="var(--text-dim)" />
        </div>
    </div>
);

const ChevronRight = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);

const TransactionItem = ({ user, amount, date }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.2rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{user}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{date}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.1rem' }}>{amount}</div>
            <div style={{ fontSize: '0.65rem', color: '#00ff00', fontWeight: 800 }}>COMPLETO</div>
        </div>
    </div>
);

const MetricsModule = () => (
    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <BarChart3 size={48} color="var(--primary)" style={{ marginBottom: '2rem' }} />
        <h2>Analítica Avanzada</h2>
        <p style={{ color: 'var(--text-dim)', maxWidth: '500px', margin: '1rem auto' }}>
            Estamos integrando un panel de métricas en tiempo real con Supabase Edge Functions. Pronto podrá ver el comportamiento exacto de sus usuarios.
        </p>
    </div>
);

const CustomersModule = ({ orders, contacts }) => {
    // Unique customers from orders
    const orderCustomers = [...new Set(orders.map(o => o.customer_email))].map(email => {
        const customerOrders = orders.filter(o => o.customer_email === email);
        return {
            email,
            name: email.split('@')[0], // Fallback if name not in contacts
            ordersCount: customerOrders.length,
            downloads: customerOrders.reduce((acc, curr) => acc + (curr.items?.length || 0), 0)
        };
    });

    return (
        <div className="glass-card" style={{ padding: '0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '2rem' }}>Cliente (Email)</th>
                        <th>Compras</th>
                        <th>Descargas</th>
                        <th>Origen</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orderCustomers.map(c => (
                        <CustomerRow key={c.email} name={c.email} email={c.email} orders={c.ordersCount} dl={c.downloads} source="Venta" />
                    ))}
                    {contacts.map(contact => (
                        <CustomerRow key={contact.id} name={contact.full_name || contact.email} email={contact.email} orders="0" dl="0" source="Contacto" />
                    ))}
                    {orderCustomers.length === 0 && contacts.length === 0 && (
                        <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No hay datos de clientes disponibles.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const CustomerRow = ({ name, email, orders, dl, source }) => (
    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
        <td style={{ padding: '1.5rem 2rem', fontWeight: 700 }}>{name}</td>
        <td style={{ textAlign: 'center' }}>{orders}</td>
        <td style={{ textAlign: 'center' }}>{dl}</td>
        <td style={{ fontSize: '0.8rem', opacity: 0.6 }}>{source}</td>
        <td><button style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}><Download size={18} /></button></td>
    </tr>
);

const AutomationModule = () => {
    const [settings, setSettings] = useState({ n8n_webhook_url: '', n8n_api_key: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const mapped = await api.getSettings();
            setSettings(mapped);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.updateSettingsBatch(settings);
            alert('Configuración guardada correctamente.');
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Cpu size={20} color="var(--primary)" /> Configuración N8N</h3>
                <p style={{ color: 'var(--text-dim)', marginTop: '1rem', marginBottom: '2.5rem' }}>Conecte su bot con flujos de trabajo en N8N.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>WEBHOOK URL (CHATBOT)</label>
                        <input
                            type="text"
                            value={settings.n8n_webhook_url}
                            onChange={e => setSettings({ ...settings, n8n_webhook_url: e.target.value })}
                            placeholder="https://n8n.tu-instancia.com/webhook/..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem', color: '#fff', borderRadius: '10px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>API KEY (OPCIONAL)</label>
                        <input
                            type="password"
                            value={settings.n8n_api_key}
                            onChange={e => setSettings({ ...settings, n8n_api_key: e.target.value })}
                            placeholder="n8n_api_key_..."
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem', color: '#fff', borderRadius: '10px' }}
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem' }}
                        disabled={saving}
                    >
                        {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '2rem' }}>Estado de Automatizaciones</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <StatusItem label="ChatBot Sync" status={settings.n8n_webhook_url ? "Activo" : "Incompleto"} />
                    <StatusItem label="Supabase Hook" status="Activo" />
                    <StatusItem label="Notification Flow" status="Activo" />
                </div>
            </div>
        </div>
    );
};

const StatusItem = ({ label, status }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--glass-border)' }}>
        <span style={{ fontWeight: 700 }}>{label}</span>
        <span style={{ color: status === 'Activo' ? '#00ff00' : 'var(--text-dim)', fontWeight: 800 }}>{status}</span>
    </div>
);

export default Admin;
