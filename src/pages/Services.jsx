import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import {
    Code, Globe, Smartphone, Box, Paintbrush, BarChart3,
    CheckCircle2, Rocket, ArrowRight, Zap, Shield, Star,
    Dna, Cpu, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
    useEffect(() => {
        window.scrollTo(0, 0);

        // Animation logic
        const ctx = gsap.context(() => {
            // Reveal hero
            gsap.from('.service-hero-content', {
                opacity: 0,
                y: 30,
                duration: 1,
                ease: 'power3.out'
            });

            // Staggered reveal for cards
            gsap.from('.service-detail-card', {
                opacity: 0,
                y: 40,
                stagger: 0.1,
                duration: 0.8,
                delay: 0.2,
                ease: 'power2.out',
                clearProps: 'all' // Crucial: clear properties after animation to avoid stuck opacity
            });
        });

        return () => ctx.revert();
    }, []);

    const allServices = [
        {
            id: 'web-dev',
            title: "Desarrollo Web",
            tag: "PERFORMANCE",
            icon: <Globe size={24} />,
            img: "/assets/service_web_dev_premium.png",
            desc: "Sitios de alto rendimiento optimizados para conversiones y SEO de clase mundial.",
            features: ["Next.js & React Mastery", "Core Web Vitals Elite", "SEO Semántico Pro"]
        },
        {
            id: 'web-app',
            title: "App Web",
            tag: "SCALABLE",
            icon: <Code size={24} />,
            img: "/assets/service_web_app_premium.png",
            desc: "Sistemas complejos que automatizan procesos y escalan tu negocio sin límites.",
            features: ["Dashboards Inteligentes", "Arquitecturas Cloud", "Seguridad Bancaria"]
        },
        {
            id: 'mobile-app',
            title: "App Móvil",
            tag: "MOBILE FIRST",
            icon: <Smartphone size={24} />,
            img: "/assets/service_mobile_app_premium.png",
            desc: "Experiencias nativas fluidas que viven en el bolsillo de tus clientes.",
            features: ["iOS & Android Nativo", "UX de Micro-interacciones", "Push Notifications"]
        },
        {
            id: '3d-modeling',
            title: "Modelos 3D",
            tag: "IMMERSIVE",
            icon: <Box size={24} />,
            img: "/assets/service_3d_modeling_premium.png",
            desc: "Visualización tridimensional que rompe la barrera entre lo digital y lo real.",
            features: ["Texturizado 8K / PBR", "Assets para Metaverso", "VFX de Nivel Cine"]
        },
        {
            id: 'ui-ux',
            title: "Diseño UI/UX",
            tag: "ELITE DESIGN",
            icon: <Paintbrush size={24} />,
            img: "/assets/service_ui_ux_premium.png",
            desc: "Creamos experiencias emocionales que retienen usuarios y aumentan el LTV.",
            features: ["Prototipado de Alta Fiel", "User Journey Mapping", "Sistemas de Diseño"]
        },
        {
            id: 'marketing',
            title: "Marketing Digital",
            tag: "GROWTH",
            icon: <BarChart3 size={24} />,
            img: "/assets/service_marketing_premium.png",
            desc: "Estrategias de crecimiento basadas en datos para dominar tu mercado.",
            features: ["Ads de Alta Conversión", "Analítica Avanzada", "Automatización CRM"]
        },
        {
            id: 'vfx',
            title: "VFX y CGI",
            tag: "VISUAL ARTS",
            icon: <Cpu size={24} />,
            img: "/assets/service_vfx_premium.png",
            desc: "Efectos visuales impactantes para comerciales y presentaciones premium.",
            features: ["Simulaciones de Partículas", "Post-producción Elite", "Motion Graphics 3D"]
        },
        {
            id: 'blockchain',
            title: "Web3 & Blockchain",
            tag: "FUTURE TECH",
            icon: <Lock size={24} />,
            img: "/assets/service_3d_modeling_premium.png",
            desc: "Desarrollo de ecosistemas descentralizados y Smart Contracts seguros.",
            features: ["Smart Contracts", "Integración de Wallets", "Arquitecturas DApp"]
        }
    ];

    return (
        <div className="services-page" style={{ paddingTop: '100px', background: 'var(--bg-deep)', minHeight: '100vh' }}>
            <div className="container" style={{ padding: '6rem 0' }}>
                <div className="service-hero-content" style={{ textAlign: 'center', marginBottom: '8rem' }}>
                    <span className="gradient-text" style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '8px', textTransform: 'uppercase' }}>EXPERIENCIAS SIN LÍMITES</span>
                    <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 900, marginTop: '2rem' }}>Catálogo <span className="gradient-text">Stratos Elite</span></h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.3rem', maxWidth: '800px', margin: '2rem auto 0' }}>8 Servicios especializados para dominar el mercado digital.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
                    {allServices.map(s => (
                        <div key={s.id} className="service-detail-card glass-card" style={{
                            padding: '0',
                            overflow: 'hidden',
                            opacity: 1 // Force base opacity to 1 to ensure visibility even if GSAP fails
                        }}>
                            <img src={s.img} alt={s.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                            <div style={{ padding: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff' }}>
                                    <span style={{ color: 'var(--primary)' }}>{s.icon}</span> {s.title}
                                </h3>
                                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>{s.desc}</p>
                                <div style={{ display: 'grid', gap: '0.8rem' }}>
                                    {s.features.map((f, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>
                                            <CheckCircle2 size={16} color="var(--primary)" /> {f}
                                        </div>
                                    ))}
                                </div>
                                <Link to="/#contact" className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem', textAlign: 'center' }}>Empezar Proyecto</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
