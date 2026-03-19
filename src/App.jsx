import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Store from './pages/Store';
import Admin from './pages/Admin';
import Services from './pages/Services';
import Checkout from './pages/Checkout';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

const AppContent = () => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <div className="app-wrapper">
            {!isAdminPage && <Navbar />}
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </main>
            {!isAdminPage && <Footer />}
            {!isAdminPage && <ChatBot />}
        </div>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
