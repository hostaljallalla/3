const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation'); // Importar el modelo

// Crear una reserva
router.post('/', async (req, res) => {
    // CAMPOS DE PAGO AÑADIDOS a la lista que se extrae del cuerpo de la petición
    const { 
        roomId, 
        clientName, 
        clientName2, 
        clientEmail, 
        numberOfGuests, 
        checkIn, 
        checkOut, 
        rutOrPassport, 
        phone, 
        nationality, 
        address,
        paymentMethod,
        paymentStatus,
        transactionId 
    } = req.body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    try {
        const newReservation = new Reservation({
            roomId,
            clientName,
            clientName2: clientName2 || null,
            clientEmail: clientEmail || null,
            numberOfGuests,
            checkIn,
            checkOut,
            nights,
            rutOrPassport,
            phone,
            nationality,
            address,
            // SE GUARDAN LOS NUEVOS CAMPOS de pago en la base de datos
            paymentMethod,
            paymentStatus,
            transactionId,
        });

        await newReservation.save();
        res.status(201).json({ message: 'Reserva creada con éxito', reservation: newReservation });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ message: 'Error interno al crear la reserva' });
    }
});

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