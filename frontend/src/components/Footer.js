import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer
            className="footer-container"
            style={{
                backgroundColor: '#203a47', // Fondo oscuro
                borderRadius: '60px', // Bordes redondeados
                color: '#f8f9fa', // Texto blanco
                textAlign: 'center',
                padding: '1em 0',
                
    
            }}
        >
            <div
                className="footer-content"
                style={{
            
                    borderRadius: '30px', // Bordes redondeados
                    display: 'inline-block', // Para ajustar al contenido
                    padding: '1px 10px', // Espaciado interno
                    
                }}
            >
                <p
                    style={{
                        fontSize: '1em', // Tamaño de fuente
                        margin: 0,
                        fontFamily: 'Arial, sans-serif',
                        
                    }}
                >
                    © {new Date().getFullYear()} Diseñado con{' '}
                    <span style={{ color: '#FF5733', fontWeight: 'bold' }}>❤</span> por{' '}
                    <span style={{ fontStyle: 'italic' }}>Filomena</span>. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
