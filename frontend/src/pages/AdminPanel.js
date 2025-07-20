import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./AdminPanel.css";
import roomsData from '../data/roomsData';

const AdminPanel = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const initialManualData = {
        roomId: roomsData[0]?.id || '',
        clientName: '',
        clientName2: '',
        rutOrPassport: '',
        phone: '',
        nationality: '',
        address: '',
        checkIn: getLocalDate(today),
        checkOut: getLocalDate(tomorrow),
        numberOfGuests: 1,
    };

    const [filterDate, setFilterDate] = useState(getLocalDate(today));
    const [manualData, setManualData] = useState(initialManualData);
    const [maintenanceData, setMaintenanceData] = useState({
        roomId: roomsData[0]?.id || '',
        checkIn: getLocalDate(today),
        checkOut: getLocalDate(tomorrow),
    });

    const roomPrices = {
        1: { priceForOne: 17000, priceForTwo: 25000 },
        2: { priceForOne: 20000, priceForTwo: 30000 },
        3: { priceForOne: 25000, priceForTwo: 40000 },
    };

const handleLogin = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "jallalla1478") {
            setIsLoggedIn(true);
        } else {
            alert("Usuario o contraseña incorrectos.");
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
        setReservations([]);
    };

    // --- FUNCIÓN CORREGIDA 1 ---
    const fetchReservations = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://three-2cs3.onrender.com/api/reservations");
            setReservations(response.data); // Lógica simplificada
        } catch (error) {
            console.error("Error al obtener reservas:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteReservation = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta reserva?")) return;
        try {
            await axios.delete(`https://three-2cs3.onrender.com/api/reservations/${id}`);
            fetchReservations();
        } catch (error) {
            console.error("Error al eliminar reserva:", error);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        const title = `Registro de Huéspedes - ${formatDateForDisplay(filterDate)}`;
        doc.text(title, 14, 16);
        const sortedReservations = [...filteredReservations].sort((a, b) => a.roomId - b.roomId);
        const head = [['ID Hab.', 'Nombre', 'RUT/Pasaporte', 'País', 'Teléfono', 'Check-In', 'Check-Out', 'Noches', 'Hora de Llegada', 'Total ($)', 'Medio de Pago', 'Pagado', 'Pendiente']];
        const body = sortedReservations.map(res => {
            const room = roomsData.find(r => r.id === res.roomId);
            const roomType = room ? room.type.toLowerCase() : '';
            const isDoubleOrMatrimonial = roomType.includes('matrimonial') || roomType.includes('doble');
            let clientNames = res.clientName;
            if (isDoubleOrMatrimonial && res.clientName2) {
                clientNames = `${res.clientName}\n${res.clientName2}`;
            }
            const pagado = res.paymentStatus === 'pagado' ? 'Pagado' : '';
            const pendiente = res.paymentStatus === 'pendiente' ? 'Pendiente' : '';
            const medioDePago = (res.paymentMethod && res.paymentMethod !== 'En Hostal') ? res.paymentMethod : '';
            return [
                res.roomId, clientNames, res.rutOrPassport, res.nationality, res.phone,
                formatDateForDisplay(res.checkIn), formatDateForDisplay(res.checkOut),
                res.nights, '', res.totalCost?.toLocaleString('es-CL') || '0', 
                medioDePago, pagado, pendiente
            ];
        });
        doc.autoTable({
            startY: 22, head: head, body: body, theme: 'grid',
            headStyles: { fillColor: [41, 128, 186] },
            didDrawCell: (data) => {
                if (data.column.index === 1 && data.row.index >= 0) {
                    const res = sortedReservations[data.row.index];
                    if (res) {
                        const room = roomsData.find(r => r.id === res.roomId);
                        if (room && (room.type.toLowerCase().includes('matrimonial') || room.type.toLowerCase().includes('doble')) && res.clientName2) {
                            const y = data.cell.y + data.cell.height / 2;
                            doc.line(data.cell.x, y, data.cell.x + data.cell.width, y);
                        }
                    }
                }
            },
        });
        doc.save(`registro_huespedes_${filterDate}.pdf`);
    };

    const handleManualFormChange = (e) => {
        const { name, value } = e.target;
        const newManualData = { ...manualData, [name]: value };
        if(name === 'roomId'){
            const room = roomsData.find(r => r.id === parseInt(value));
            if(room && room.type.toLowerCase().includes('individual')){
                newManualData.numberOfGuests = 1;
            }
        }
        if (name === 'numberOfGuests' && value === '1') {
            newManualData.clientName2 = '';
        }
        setManualData(newManualData);
    };

    const handleMaintenanceFormChange = (e) => setMaintenanceData({ ...maintenanceData, [e.target.name]: e.target.value });

    // --- FUNCIÓN CORREGIDA 2 ---
    const handleManualSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://three-2cs3.onrender.com/api/reservations', { 
                ...manualData, 
                roomId: parseInt(manualData.roomId),
                numberOfGuests: parseInt(manualData.numberOfGuests),
                clientName2: manualData.numberOfGuests == 2 ? manualData.clientName2 : undefined,
                paymentMethod: 'En Hostal',
                paymentStatus: 'pendiente',
            });
            alert('¡Reserva manual creada con éxito!');
            fetchReservations();
            setManualData(initialManualData); 
        } catch (error) {
            alert('Error al crear la reserva.');
            console.error(error);
        }
    };

    // --- FUNCIÓN CORREGIDA 3 ---
    const handleMaintenanceSubmit = async (e) => {
        e.preventDefault();
        try {
            const availabilityResponse = await axios.post('https://three-2cs3.onrender.com/api/reservations/check-availability', {
                checkIn: maintenanceData.checkIn,
                checkOut: maintenanceData.checkOut,
                roomId: parseInt(maintenanceData.roomId),
            });
            if (availabilityResponse.data.unavailableRooms?.includes(parseInt(maintenanceData.roomId))) {
                alert('Error: La habitación ya está ocupada en las fechas seleccionadas para mantenimiento.');
                return;
            }
            await axios.post('https://three-2cs3.onrender.com/api/reservations', {
                ...maintenanceData,
                roomId: parseInt(maintenanceData.roomId),
                clientName: 'MANTENIMIENTO',
                rutOrPassport: 'N/A', phone: 'N/A', nationality: 'N/A', address: 'N/A', numberOfGuests: 0,
                totalCost: 0, 
            });
            alert('¡Fechas bloqueadas por mantenimiento!');
            fetchReservations();
        } catch (error) {
            alert('Error al bloquear fechas.');
            console.error(error);
        }
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return "N/A";
        const datePart = dateString.split('T')[0];
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        if (isLoggedIn) { fetchReservations(); }
    }, [isLoggedIn]);

    const filteredReservations = reservations.filter(res => {
        const checkIn = res.checkIn.split('T')[0];
        const checkOut = res.checkOut.split('T')[0];
        return filterDate >= checkIn && filterDate < checkOut;
    });

    const selectedRoomForManualEntry = roomsData.find(r => r.id === parseInt(manualData.roomId));

return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            {!isLoggedIn ? (
                <form onSubmit={handleLogin}>
                    <h2>Iniciar Sesión</h2>
                    <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: "10px", marginBottom: "10px", width: "200px" }} required />
                    <br />
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "10px", marginBottom: "10px", width: "200px" }} required />
                    <br />
                    <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>Ingresar</button>
                </form>
            ) : (
                <div>
                    <h2>Panel de Administración</h2>
                    <div className="admin-actions">
                        <button onClick={handleLogout} className="back-btn">Cerrar Sesión</button>
                        <button onClick={() => navigate("/")} className="back-btn">Volver a Inicio</button>
                        <button onClick={downloadPDF} className="back-btn">Descargar PDF de la vista actual</button>
                    </div>

                    <div className="admin-section">
                        <h3>Crear Reserva Manualmente</h3>
                        <form onSubmit={handleManualSubmit} className="admin-form">
                            <select name="roomId" value={manualData.roomId} onChange={handleManualFormChange}>
                                {roomsData.map(room => <option key={room.id} value={room.id}>{`${room.type} (ID: ${room.id})`}</option>)}
                            </select>
                            {selectedRoomForManualEntry && !selectedRoomForManualEntry.type.toLowerCase().includes('individual') && (
                                <select name="numberOfGuests" value={manualData.numberOfGuests} onChange={handleManualFormChange}>
                                    <option value={1}>1 Huésped</option>
                                    <option value={2}>2 Huéspedes</option>
                                </select>
                            )}
                            <input name="clientName" type="text" placeholder="Nombre Cliente 1" value={manualData.clientName} onChange={handleManualFormChange} required />
                            {manualData.numberOfGuests == 2 && selectedRoomForManualEntry && !selectedRoomForManualEntry.type.toLowerCase().includes('individual') && (
                                <input name="clientName2" type="text" placeholder="Nombre Cliente 2" value={manualData.clientName2} onChange={handleManualFormChange} />
                            )}
                            <input name="rutOrPassport" type="text" placeholder="RUT o Pasaporte" value={manualData.rutOrPassport} onChange={handleManualFormChange} required />
                            <input name="phone" type="text" placeholder="Teléfono" value={manualData.phone} onChange={handleManualFormChange} />
                            <input name="nationality" type="text" placeholder="Nacionalidad" value={manualData.nationality} onChange={handleManualFormChange} />
                            <input name="address" type="text" placeholder="Dirección" value={manualData.address} onChange={handleManualFormChange} />
                            <label>Check-in: <input name="checkIn" type="date" value={manualData.checkIn} onChange={handleManualFormChange} /></label>
                            <label>Check-out: <input name="checkOut" type="date" value={manualData.checkOut} onChange={handleManualFormChange} /></label>
                            <button type="submit">Crear Reserva</button>
                        </form>
                    </div>

                    <div className="admin-section">
                        <h3>Bloquear Fechas por Mantenimiento</h3>
                        <form onSubmit={handleMaintenanceSubmit} className="admin-form">
                            <select name="roomId" value={maintenanceData.roomId} onChange={handleMaintenanceFormChange}>
                                {roomsData.map(room => <option key={room.id} value={room.id}>{`${room.type} (ID: ${room.id})`}</option>)}
                            </select>
                            <label>Desde: <input name="checkIn" type="date" value={maintenanceData.checkIn} onChange={handleMaintenanceFormChange} /></label>
                            <label>Hasta: <input name="checkOut" type="date" value={maintenanceData.checkOut} onChange={handleMaintenanceFormChange} /></label>
                            <button type="submit">Bloquear Habitación</button>
                        </form>
                    </div>

                    <div className="admin-section">
                        <h3>Filtrar Reservas por Fecha</h3>
                        <div className="filter-container">
                            <label>Mostrar reservas activas el día:</label>
                            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                        </div>
                    </div>
                    
                    {loading ? (
                        <p>Cargando reservas...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Cliente</th><th>Teléfono</th><th>RUT/Pasaporte</th><th>Nacionalidad</th><th>Dirección</th><th>Habitación</th><th>Check-In</th><th>Check-Out</th><th>Noches</th><th>Precio Total</th><th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReservations.map((res) => (
                                    <tr key={res._id} className={res.clientName === 'MANTENIMIENTO' ? 'maintenance-row' : ''}>
                                        <td>{res.clientName2 ? `${res.clientName} / ${res.clientName2}`: res.clientName}</td>
                                        <td>{res.phone}</td>
                                        <td>{res.rutOrPassport}</td>
                                        <td>{res.nationality}</td>
                                        <td>{res.address}</td>
                                        <td>{`${roomsData.find(r => r.id === res.roomId)?.type || 'Habitación'} (ID: ${res.roomId})`}</td>
                                        <td>{formatDateForDisplay(res.checkIn)}</td>
                                        <td>{formatDateForDisplay(res.checkOut)}</td>
                                        <td>{res.nights}</td>
                                        <td>{res.totalCost?.toLocaleString()} CLP</td>
                                        <td><button className="delete-btn" onClick={() => deleteReservation(res._id)}>Eliminar</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;