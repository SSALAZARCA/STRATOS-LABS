import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper for smooth scroll
    const scrollToSection = (id) => {
        if (location.pathname === '/') {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <header className={scrolled ? 'scrolled' : ''} style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1000,
            padding: scrolled ? '0.8rem 0' : '1.5rem 0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: scrolled ? 'rgba(2, 4, 8, 0.85)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderBottom: scrolled ? '1px solid var(--glass-border)' : 'none'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="logo" style={{
                    fontSize: '1.7rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'var(--transition)'
                }}>
                    <span style={{ color: '#fff', filter: 'drop-shadow(0 0 8px var(--primary-glow))' }}>STRATOS</span>
                    <span className="gradient-text">LABS</span>
                </Link>
                <nav style={{ display: 'flex', gap: '3.5rem', alignItems: 'center' }}>
                    <Link to="/" className="nav-link">Inicio</Link>
                    <Link to="/services" className="nav-link">Servicios</Link>
                    <Link to="/store" className="nav-link">Tienda 3D</Link>
                    <a href="/#contact" onClick={() => scrollToSection('contact')} className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '0.8rem', gap: '0.8rem' }}>
                        Empezar Proyecto <Rocket size={16} />
                    </a>
                </nav>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .nav-link {
                    color: var(--text-dim) !important;
                    font-size: 0.85rem;
                    font-weight: 700;
                    transition: var(--transition);
                    position: relative;
                    text-decoration: none;
                    opacity: 0.8;
                }
                .nav-link:hover {
                    color: var(--primary) !important;
                    opacity: 1;
                    filter: drop-shadow(0 0 5px var(--primary-glow));
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 50%;
                    width: 0;
                    height: 2px;
                    background: var(--primary);
                    transition: var(--transition);
                    transform: translateX(-50%);
                    box-shadow: 0 0 10px var(--primary);
                }
                .nav-link:hover::after {
                    width: 100%;
                }
                .logo:hover {
                    transform: scale(1.05);
                    filter: brightness(1.2);
                }
            `}} />
        </header>
    );
};

export default Navbar;
