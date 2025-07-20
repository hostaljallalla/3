// Contenido final para: frontend/src/data/roomsData.js

const roomsData = [
    // Habitaciones Matrimoniales con Baño Compartido
    { 
        id: 1, 
        type: "Habitación Matrimonial con Baño Compartido", 
        priceForOne: 20000, 
        priceForTwo: 25000, 
        images: [
            "/images/room1.jpg", 
            "/images/matrimonial1-1.jpg",
            "/images/matrimonial1-2.jpg",
            "/images/matrimonial1-3.jpg"
        ], 
    },
    { id: 2, type: "Habitación Matrimonial con Baño Compartido", priceForOne: 20000, priceForTwo: 25000, images: ["/images/room2.jpg"] },
    { id: 3, type: "Habitación Matrimonial con Baño Compartido", priceForOne: 20000, priceForTwo: 25000, images: ["/images/room3.jpg"] },
    { id: 6, type: "Habitación Matrimonial con Baño Compartido", priceForOne: 20000, priceForTwo: 25000, images: ["/images/room6.jpg"] },
    { id: 9, type: "Habitación Matrimonial con Baño Compartido", priceForOne: 20000, priceForTwo: 25000, images: ["/images/room9.jpg"] },
    { id: 10, type: "Habitación Matrimonial con Baño Compartido", priceForOne: 20000, priceForTwo: 25000, images: ["/images/room10.jpg"] },
    { id: 11, type: "Habitación Matrimonial con Baño Compartido", priceForOne: 20000, priceForTwo: 25000, images: ["/images/room11.jpg"] },

    // Habitaciones Matrimoniales con Baño Privado
    { 
        id: 7, 
        type: "Habitación Matrimonial con Baño Privado", 
        priceForOne: 30000, 
        priceForTwo: 40000, 
        images: [
            "/images/room7.jpg",
            "/images/privada-detalle-1.jpg"
        ], 
    },
    { id: 12, type: "Habitación Matrimonial con Baño Privado", priceForOne: 30000, priceForTwo: 40000, images: ["/images/room12.jpg"] },
    { id: 13, type: "Habitación Matrimonial con Baño Privado", priceForOne: 30000, priceForTwo: 40000, images: ["/images/room13.jpg"] },
    { id: 14, type: "Habitación Matrimonial con Baño Privado", priceForOne: 30000, priceForTwo: 40000, images: ["/images/room14.jpg"] },
    { id: 15, type: "Habitación Matrimonial con Baño Privado", priceForOne: 30000, priceForTwo: 40000, images: ["/images/room15.jpg"] },

    // Habitaciones Individuales con Baño Compartido
    { id: 4, type: "Habitación Individual con Baño Compartido", priceForOne: 17000, images: ["/images/room4.jpg"] },
    { id: 5, type: "Habitación Individual con Baño Compartido", priceForOne: 17000, images: ["/images/room5.jpg"] },
    { id: 8, type: "Habitación Individual con Baño Compartido", priceForOne: 17000, images: ["/images/room8.jpg"] },

    // Habitación Doble con Baño Compartido
    { id: 16, type: "Habitación Doble con Baño Compartido", priceForOne: 25000, priceForTwo: 30000, images: ["/images/room16.jpg"] },

    // Habitación Doble con Baño Privado
    { id: 17, type: "Habitación Doble con Baño Privado", priceForOne: 35000, priceForTwo: 40000, images: ["/images/room17.jpg"] },
];

module.exports = roomsData;