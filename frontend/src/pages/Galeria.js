import React from 'react';

const Galeria = () => {
    // Nombres de las imágenes guardadas en public/images
    const images = [
        '/images/galeria1.jpg',
        '/images/galeria2.jpg',
        '/images/galeria3.jpg',
        '/images/galeria4.jpg',
    ];

    return (
        <div
            style={{
                padding: '20px',
                backgroundColor: '#f9f9f9',
                minHeight: '100vh',
                textAlign: 'center',
            }}
        >
            <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>Galería</h1>

            {/* Contenedor de la galería */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    maxWidth: '1000px',
                    margin: '0 auto',
                }}
            >
                {images.map((src, index) => (
                    <div key={index}>
                        <img
                            src={src}
                            alt={`Imagen ${index + 1}`}
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '100px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Galeria;

