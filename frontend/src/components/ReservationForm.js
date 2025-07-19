import React, { useState } from 'react';
import axios from 'axios';

const ReservationForm = ({ room, onClose }) => {
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [rutOrPassport, setRutOrPassport] = useState(''); // Nuevo campo
    const [phone, setPhone] = useState(''); // Nuevo campo
    const [nationality, setNationality] = useState(''); // Nuevo campo
    const [address, setAddress] = useState(''); // Nuevo campo

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const reservationData = {
                roomId: room.id,
                clientName,
                clientEmail,
                numberOfGuests,
                rutOrPassport, // Agregar al objeto
                phone, // Agregar al objeto
                nationality, // Agregar al objeto
                address, // Agregar al objeto
                checkIn: "2024-12-20", // Fecha estática (puedes cambiarla)
                checkOut: "2024-12-25", // Fecha estática (puedes cambiarla)
            };

            // Enviar los datos al backend
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/reservations`, 
                reservationData
            );

            alert(response.data.message); // Mensaje del backend
            onClose(); // Cierra el formulario
        } catch (error) {
            console.error('Error al realizar la reserva:', error.response?.data || error.message);
            alert('Hubo un problema al realizar la reserva.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Reservar Habitación {room.id}</h2>
            <label>
                Nombre:
                <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Correo Electrónico:
                <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Número de Personas:
                <select
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                </select>
            </label>
            <br />
            <label>
                RUT o Pasaporte:
                <input
                    type="text"
                    value={rutOrPassport}
                    onChange={(e) => setRutOrPassport(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Teléfono:
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Nacionalidad:
                <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Dirección:
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
            </label>
            <br />
            <button type="submit">Confirmar Reserva</button>
            <button type="button" onClick={onClose}>
                Cancelar
            </button>
        </form>
    );
};

export default ReservationForm;





