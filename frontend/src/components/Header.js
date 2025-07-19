import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import headerImage from '../images/header-background.jpg';

const Header = () => {
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    // Cierra el menú de admin si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setAdminMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAdminClick = () => {
        navigate('/admin');
        setAdminMenuOpen(false);
    };

    return (
        <header className="header-container">
            <div className="header-background" style={{ backgroundImage: `url(${headerImage})` }}></div>
            <div className="header-content">

                {/* --- FILA SUPERIOR --- */}
                <h1 className="header-title">Hostal Jallalla</h1>

                {/* --- FILA INFERIOR --- */}
                <div className="header-bottom-row">
                    {/* Elemento Izquierda: Logo */}
                    <Link to="/" className="logo-container">
                        <img src="/images/logo.png" alt="Logo del Hostal" className="logo" />
                    </Link>

                    {/* Elemento Central: Navegación Principal */}
                    <nav className="main-nav">
                        <ul className="nav-links">
                            <li><Link to="/" className="nav-button">Inicio</Link></li>
                            <li><Link to="/nosotros" className="nav-button">Nosotros</Link></li>
                            <li><Link to="/galeria" className="nav-button">Galería</Link></li>
                        </ul>
                    </nav>

                    {/* Elemento Derecha: Botón Admin (escritorio) y Menú Hamburguesa (móvil) */}
                    <div className="admin-area">
                        <div className="admin-button-desktop">
                            <button className="admin-button" onClick={() => navigate('/admin')}>
                                Administrador
                            </button>
                        </div>
                        <div className="mobile-admin-menu" ref={menuRef}>
                            <button className="menu-toggle" onClick={() => setAdminMenuOpen(!adminMenuOpen)}>
                                <span className="hamburger-line"></span>
                                <span className="hamburger-line"></span>
                                <span className="hamburger-line"></span>
                            </button>
                            {adminMenuOpen && (
                                <div className="dropdown-menu">
                                    <button className="admin-button" onClick={handleAdminClick}>
                                        Administrador
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;