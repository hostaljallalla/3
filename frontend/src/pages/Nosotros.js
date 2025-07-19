import React from 'react';

const Nosotros = () => {
    return (
        <div
            style={{
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                minHeight: '100vh',
            }}
        >
            <h1 style={{ fontSize: '2.5rem', color: '#007bff', marginBottom: '20px' }}>
                Sobre Nosotros
            </h1>
            <p
                style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.6',
                    color: '#333',
                    maxWidth: '800px',
                    margin: '0 auto 20px auto',
                }}
            >
                Bienvenido al <strong>Hostal Ejemplo</strong>, un lugar acogedor donde el descanso y
                la comodidad son nuestra prioridad. Contamos con instalaciones modernas y un
                servicio de alta calidad.
            </p>

            {/* Imagen desde carpeta public */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <img
                    src="/images/hostal1.jpg" /* Ruta relativa desde public */
                    alt="Imagen del Hostal"
                    style={{
                        width: '100%',
                        maxWidth: '600px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    }}
                />
            </div>

            {/* Texto adicional */}
            <p
                style={{
                    fontSize: '1.1rem',
                    color: '#555',
                    maxWidth: '800px',
                    margin: '0 auto',
                }}
            >
                Nuestra ubicación privilegiada te permitirá acceder a las mejores atracciones
                turísticas y servicios de la ciudad. ¡Esperamos tu visita!
            </p>
        </div>
    );
};

export default Nosotros;

