import React from 'react';

const Footer = () => (
    <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--glass-border)', textAlign: 'center', color: 'var(--text-dim)' }}>
        <div className="container">
            <div className="logo" style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
                STRATOS <span className="gradient-text">LABS</span>
            </div>
            <p>&copy; 2026 Stratos Labs. Todos los derechos reservados.</p>
        </div>
    </footer>
);

export default Footer;
