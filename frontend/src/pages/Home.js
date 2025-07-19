// src/pages/Home.js

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import roomsData from '../data/roomsData';
import '../styles/Home.css';


const Home = () => {
    const today = new Date();
    const exchangeRate = 900;
    const navigate = useNavigate();

    const [checkIn, setCheckIn] = useState(today);
    const [availability, setAvailability] = useState({});
    const [loading, setLoading] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const calendarRef = useRef(null);

    const [selectedOptions, setSelectedOptions] = useState(
        roomsData.reduce((acc, room) => ({ ...acc, [room.id]: 1 }), {})
    );
    const [expandedGroups, setExpandedGroups] = useState({});

    const groupedRooms = roomsData.reduce((acc, room) => {
        acc[room.type] = acc[room.type] || [];
        acc[room.type].push(room);
        return acc;
    }, {});

    // Cerrar calendario si haces clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setCalendarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calcular disponibilidad al cambiar fecha
    useEffect(() => {
        const calculateAvailability = async () => {
            setLoading(true);
            const updated = {};
            const isoDate = new Date(
                checkIn.getTime() - checkIn.getTimezoneOffset() * 60000
            )
                .toISOString()
                .split('T')[0];

            try {
                const res = await fetch('https://three-2cs3.onrender.com/api/reservations');
                const allReservations = await res.json();
                for (const room of roomsData) {
                    let isAvail = true;
                    for (const r of allReservations) {
                        if (r.roomId === room.id) {
                            const ci = r.checkIn.split('T')[0];
                            const co = r.checkOut.split('T')[0];
                            if (isoDate >= ci && isoDate < co) {
                                isAvail = false;
                                break;
                            }
                        }
                    }
                    updated[room.id] = isAvail;
                }
                setAvailability(updated);
            } catch (err) {
                console.error('Error al verificar disponibilidad:', err);
            } finally {
                setLoading(false);
            }
        };
        calculateAvailability();
    }, [checkIn]);

    const handleSelectChange = (id, value) => {
        setSelectedOptions(prev => ({ ...prev, [id]: value }));
    };

    const convertToUSD = clp => (clp / exchangeRate).toFixed(2);

    const toggleGroup = type => {
        setExpandedGroups(prev => ({ ...prev, [type]: !prev[type] }));
    };

    return (
        <div className="home-container">
            {/* Vídeo de fondo de olas */}
            <video autoPlay loop muted playsInline className="video-background">
                <source src="/videos/background.mp4" type="video/mp4" />
                Tu navegador no soporta la etiqueta <code>video</code>.
            </video>

            <h1 className="home-title">Bienvenido al Hostal Jallalla</h1>

            {/* Selector de fecha */}
            <div className="calendar-container">
                <span className="calendar-message">
                    Seleccione una fecha para ver disponibilidad
                </span>
                <button
                    onClick={() => setCalendarOpen(o => !o)}
                    className="calendar-toggle-btn"
                >
                    {checkIn.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                </button>
                {calendarOpen && (
                    <div className="calendar-dropdown" ref={calendarRef}>
                        <Calendar
                            onChange={date => {
                                setCheckIn(date);
                                setCalendarOpen(false);
                            }}
                            value={checkIn}
                            minDate={today}
                        />
                    </div>
                )}
            </div>

            {loading ? (
                <p className="loading-message">Cargando disponibilidad...</p>
            ) : (
                Object.entries(groupedRooms).map(([type, roomsInGroup]) => {
                    const sorted = [...roomsInGroup].sort((a, b) => {
                        const avA = +!!availability[a.id];
                        const avB = +!!availability[b.id];
                        if (avA === avB) return a.id - b.id;
                        return avB - avA;
                    });
                    const expanded = !!expandedGroups[type];
                    const visible = expanded ? sorted : sorted.slice(0, 1);

                    return (
                        <React.Fragment key={type}>
                            <h2 className="room-group-title">{type}</h2>
                            <div className="room-group">
                                {visible.map(room => (
                                    <div
                                        key={room.id}
                                        className="room-card"
                                        onClick={() =>
                                            availability[room.id] &&
                                            navigate(`/room/${room.id}`)
                                        }
                                        style={{
                                            cursor: availability[room.id]
                                                ? 'pointer'
                                                : 'not-allowed'
                                        }}
                                    >
                                        <img
                                            src={room.image}
                                            alt={room.type}
                                            className="room-image"
                                        />
                                        <p className="room-id">
                                            ID: <strong>{room.id}</strong>
                                        </p>
                                        <p>
                                            Precio por noche:{' '}
                                            <strong>
                                                {selectedOptions[room.id] === 2 && room.priceForTwo
                                                    ? `${room.priceForTwo} CLP ($${convertToUSD(
                                                          room.priceForTwo
                                                      )} USD)`
                                                    : `${room.priceForOne} CLP ($${convertToUSD(
                                                          room.priceForOne
                                                      )} USD)`}
                                            </strong>
                                        </p>
                                        <label>
                                            Personas:{' '}
                                            <select
                                                value={selectedOptions[room.id]}
                                                onChange={e =>
                                                    handleSelectChange(
                                                        room.id,
                                                        +e.target.value
                                                    )
                                                }
                                                onClick={e => e.stopPropagation()}
                                            >
                                                <option value={1}>1 Persona</option>
                                                {room.priceForTwo && (
                                                    <option value={2}>2 Personas</option>
                                                )}
                                            </select>
                                        </label>
                                        <p className="room-availability">
                                            <span
                                                className={
                                                    availability[room.id]
                                                        ? 'available'
                                                        : 'not-available'
                                                }
                                            >
                                                {availability[room.id]
                                                    ? 'Disponible'
                                                    : 'No disponible'}
                                            </span>
                                        </p>
                                        <Link
                                            to={`/room/${room.id}`}
                                            className={`details-btn ${
                                                availability[room.id] ? '' : 'disabled'
                                            }`}
                                            style={{
                                                pointerEvents: availability[room.id]
                                                    ? 'auto'
                                                    : 'none',
                                                backgroundColor: availability[room.id]
                                                    ? '#007bff'
                                                    : '#ccc',
                                                cursor: availability[room.id]
                                                    ? 'pointer'
                                                    : 'not-allowed'
                                            }}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            {availability[room.id]
                                                ? 'Ver Detalles'
                                                : 'No disponible'}
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {roomsInGroup.length > 1 && (
                                <button
                                    onClick={() => toggleGroup(type)}
                                    className="show-more-btn"
                                >
                                    {expanded
                                        ? 'Ver menos'
                                        : `Ver ${roomsInGroup.length - 1} más...`}
                                    <span className={`arrow ${expanded ? 'up' : 'down'}`}></span>
                                </button>
                            )}
                        </React.Fragment>
                    );
                })
            )}

        
        </div>
    );
};

export default Home;
