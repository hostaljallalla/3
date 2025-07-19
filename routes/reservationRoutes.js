const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation'); // Importar el modelo

// --- SECCIÓN MODIFICADA ---
// Crear una reserva (ahora usa un método más robusto)
router.post('/', async (req, res) => {
    console.log("Backend recibió en req.body:", req.body);
    try {
        // Se extraen las fechas para el cálculo seguro en el backend
        const { checkIn, checkOut } = req.body;
        
        // Se calcula el número de noches en el backend para mayor seguridad
        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));

        // Se crea la nueva reserva usando el método robusto:
        // 1. Se pasan TODOS los campos que vienen del frontend con "...req.body"
        // 2. Se sobreescribe el campo "nights" con el valor calculado aquí
        const newReservation = new Reservation({
            ...req.body,
            nights: nights,
        });

        await newReservation.save();
        res.status(201).json({ message: 'Reserva creada con éxito', reservation: newReservation });

    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ message: 'Error interno al crear la reserva' });
    }
});

// --- EL RESTO DEL ARCHIVO PERMANECE IGUAL ---
// Verificar disponibilidad de habitaciones
router.post('/check-availability', async (req, res) => {
    const { checkIn, checkOut } = req.body;

    if (!checkIn || !checkOut) {
        return res.status(400).json({ message: 'Las fechas de check-in y check-out son obligatorias' });
    }

    try {
        const overlappingReservations = await Reservation.find({
            $or: [
                { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } },
            ],
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

// Obtener todas las reservas con filtros opcionales
router.get('/', async (req, res) => {
    const { startDate, endDate, roomId } = req.query;

    try {
        const filter = {};
        if (startDate && endDate) {
            filter.checkIn = { $gte: new Date(startDate) };
            filter.checkOut = { $lte: new Date(endDate) };
        }
        if (roomId) {
            filter.roomId = parseInt(roomId);
        }

        const reservations = await Reservation.find(filter).sort({ checkIn: 1 });
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ message: 'Error interno al obtener reservas' });
    }
});

// Eliminar una reserva por ID
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