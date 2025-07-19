import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room, availability, selectedOptions, handleSelectChange }) => {
    const isAvailable = availability ?? true;

    return (
        <div className="room-card">
            <img src={room.image} alt={room.type} className="room-image" />
            <p className="room-id">ID: <strong>{room.id}</strong></p>
            <h2>{room.type}</h2>

            <p>
                Precio: <strong>
                    {selectedOptions[room.id] === 2 && room.priceForTwo
                        ? `${room.priceForTwo} CLP`
                        : `${room.priceForOne} CLP`}
                </strong>
            </p>

            <label>
                Personas:
                <select
                    value={selectedOptions[room.id] || 1}
                    onChange={(e) => handleSelectChange(room.id, parseInt(e.target.value))}
                >
                    <option value={1}>1 Persona</option>
                    {room.priceForTwo && <option value={2}>2 Personas</option>}
                </select>
            </label>

            <p className="room-availability">
                <span className={isAvailable ? "available" : "not-available"}>
                    {isAvailable ? "Disponible" : "No disponible"}
                </span>
            </p>

            <Link
                to={`/room/${room.id}`}
                className={`details-btn ${isAvailable ? "" : "disabled"}`}
                style={{
                    pointerEvents: isAvailable ? "auto" : "none",
                    backgroundColor: isAvailable ? "#007bff" : "#ccc",
                    cursor: isAvailable ? "pointer" : "not-allowed",
                }}
            >
                {isAvailable ? "Ver Detalles" : "No disponible"}
            </Link>
        </div>
    );
};

export default RoomCard;

