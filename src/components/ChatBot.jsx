import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { getSettings } from '../services/api';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [chat, setChat] = useState([
        { role: 'assistant', text: '¡Hola! Soy el asistente de Stratos Labs. ¿En qué puedo ayudarte hoy?' }
    ]);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const settings = await getSettings();
                if (settings.n8n_webhook_url) {
                    setWebhookUrl(settings.n8n_webhook_url);
                }
            } catch (error) {
                console.error('Error fetching chatbot config:', error);
            }
        };
        fetchConfig();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userText = message.trim();
        const newUserMessage = { role: 'user', text: userText };
        setChat([...chat, newUserMessage]);
        setMessage('');

        // N8N Integration
        try {
            const url = webhookUrl || 'https://n8n-psckg4osc0s0kw0o444ggwks.72.62.130.152.sslip.io/webhook-test/chat-bot';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userText,
                    source: 'Stratos Web App',
                    timestamp: new Date().toISOString()
                }),
            });

            if (!response.ok) throw new Error('Servidor N8N devolvió error');

            const data = await response.json().catch(() => ({}));

            // Handle different N8N output formats
            const botResponse = data.output || data.message || (Array.isArray(data) && data[0]?.output) || null;

            if (botResponse) {
                setChat(prev => [...prev, {
                    role: 'assistant',
                    text: botResponse
                }]);
            } else {
                console.log('N8N sent empty response or trigger-only mode');
            }
        } catch (error) {
            console.error('Bot Integration Error:', error);
            setChat(prev => [...prev, {
                role: 'assistant',
                text: '⚠️ No pude leer la respuesta de N8N. Asegúrate de que el Webhook en N8N tenga habilitado CORS para http://localhost:5173'
            }]);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
            {/* Chat Bubble */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="float-anim"
                    style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        border: 'none',
                        boxShadow: '0 0 30px var(--primary-glow)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000'
                    }}
                >
                    <Bot size={30} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="glass-card" style={{
                    width: '380px',
                    height: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'float 6s infinite ease-in-out',
                    border: '1px solid var(--primary)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'linear-gradient(90deg, rgba(0, 242, 255, 0.1), transparent)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--primary-glow)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bot size={20} color="var(--primary)" />
                            </div>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 900 }}>StratosBot</div>
                                <div style={{ fontSize: '0.7rem', color: '#00ff00' }}>● Automatizado con N8N</div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {chat.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '1rem',
                                borderRadius: m.role === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                                background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                color: m.role === 'user' ? '#000' : '#fff',
                                fontSize: '0.9rem',
                                fontWeight: m.role === 'user' ? 700 : 400
                            }}>
                                {m.text}
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Escribe un mensaje..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{ flex: 1, padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: '#fff' }}
                        />
                        <button type="submit" style={{ width: '45px', height: '45px', borderRadius: '10px', background: 'var(--primary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Send size={18} color="#000" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
