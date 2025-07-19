const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    roomId: { type: Number, required: true }, // ID de la habitación reservada
    clientName: { type: String, required: true }, // Nombre del cliente principal
    clientName2: { type: String, required: false }, // Nombre del segundo cliente (opcional)
    clientEmail: { type: String, required: false }, // Correo electrónico (opcional)
    numberOfGuests: { type: Number, required: true }, // Número de huéspedes
    checkIn: { type: Date, required: true }, // Fecha de ingreso
    checkOut: { type: Date, required: true }, // Fecha de salida
    nights: { type: Number, required: true }, // Cantidad de noches
    rutOrPassport: { type: String, required: true }, // RUT o pasaporte del cliente
    phone: { type: String, required: true }, // Teléfono del cliente
    nationality: { type: String, required: true }, // Nacionalidad del cliente
    address: { type: String, required: true }, // Dirección del cliente
    
    // --- LÍNEAS AÑADIDAS PARA EL ESTADO DEL PAGO ---
    paymentMethod: { type: String, default: 'En hostal' },
    paymentStatus: { type: String, default: 'pendiente' },
    transactionId: { type: String, default: 'N/A' },
});

// Exporta el modelo para usarlo en el backend
module.exports = mongoose.model('Reservation', ReservationSchema);