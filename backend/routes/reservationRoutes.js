const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
// Se importa la fuente de datos de las habitaciones para poder calcular precios de forma segura.
const roomsData = require('../data/roomsData'); 

// --- RUTA POST MODIFICADA PARA SER MÁS SEGURA ---
router.post('/', async (req, res) => {
    try {
        // 1. Extraer solo los datos necesarios y seguros del frontend.
        const { roomId, checkIn, checkOut, numberOfGuests } = req.body;

        // 2. Buscar la información de la habitación en nuestra fuente de datos segura (backend).
        const room = roomsData.find(r => r.id === parseInt(roomId));
        if (!room) {
            return res.status(404).json({ message: 'La habitación especificada no existe.' });
        }
        
        // 3. Calcular noches y costo total de forma segura en el backend.
        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        
        let totalCost = 0;
        // Para reservas de mantenimiento, el costo es 0. Para las demás, se calcula.
        if (req.body.clientName !== 'MANTENIMIENTO') {
            const pricePerNight = parseInt(numberOfGuests) === 1 ? room.priceForOne : room.priceForTwo;
            totalCost = nights * pricePerNight;
        }

        // 4. Crear la nueva reserva con datos del frontend y los valores seguros calculados aquí.
        const newReservation = new Reservation({
            ...req.body,      // Se mantienen los otros datos (nombre, rut, paymentStatus, etc.)
            nights: nights,   // Se usa el valor de noches calculado y seguro.
            totalCost: totalCost, // Se usa el valor de costo calculado y seguro.
        });

        await newReservation.save();
        res.status(201).json({ message: 'Reserva creada con éxito', reservation: newReservation });

    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ message: 'Error interno al crear la reserva' });
    }
});

// --- EL RESTO DE RUTAS NO CAMBIAN ---
router.post('/check-availability', async (req, res) => {
    const { checkIn, checkOut } = req.body;
    if (!checkIn || !checkOut) {
        return res.status(400).json({ message: 'Las fechas de check-in y check-out son obligatorias' });
    }
    try {
        const overlappingReservations = await Reservation.find({
            $or: [{ checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }],
        });
        const unavailableRooms = overlappingReservations.map((reservation) => reservation.roomId);
        res.status(200).json({
            unavailableRooms,
            message: 'Disponibilidad verificada correctamente',
        });
    } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        res.status(500).json({ message: 'Error interno al verificar disponibilidad' });
    }
});

router.get('/', async (req, res) => {
    // ... tu código get existente ...
    try {
        const reservations = await Reservation.find({}).sort({ checkIn: 1 });
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ message: 'Error interno al obtener reservas' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Reservation.findByIdAndDelete(id);
        res.status(200).json({ message: 'Reserva eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar reserva:', error);
        res.status(500).json({ message: 'Error interno al eliminar la reserva' });
    }
});

module.exports = router;