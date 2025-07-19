import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import rooms from '../data/rooms';
import Calendar from 'react-calendar';
import PaypalButton from '../PaypalButton';
import { Carousel } from 'react-responsive-carousel';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const RoomDetails = () => {
    // Tus estados originales
    const [paypalKey, setPaypalKey] = useState(0);
    const [isLightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const refreshPaypalButton = () => setPaypalKey(prevKey => prevKey + 1);
    const confirmReservationRef = useRef(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const room = rooms.find((room) => room.id === parseInt(id));
    const [selectedDate, setSelectedDate] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false);
    const [selectedOption, setSelectedOption] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
    const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
    const checkInRef = useRef(null);
    const checkOutRef = useRef(null);
    const [formData, setFormData] = useState({
        clientName: '',
        clientName2: '',
        clientEmail: '',
        rutOrPassport: '',
        phone: '',
        nationality: '',
        address: '',
    });

    // --- CAMBIO 1: Se AÑADEN estas líneas para solucionar el "Estado Rancio" ---
    const formDataRef = useRef(formData);
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);
    // --- FIN DEL CAMBIO 1 ---

    // Tus useEffect originales no se modifican
    useEffect(() => {
        if (!isAvailable || !selectedDate || !checkOut) {
            setShowForm(false);
        }
    }, [isAvailable, selectedDate, checkOut]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const calendarElements = [ '.react-calendar', '.react-calendar__navigation', '.react-calendar__navigation__arrow', '.react-calendar__tile', '.react-calendar__month-view__days' ];
            const isClickInsideCalendar = calendarElements.some((selector) => event.target.closest(selector));
            if (!isClickInsideCalendar) {
                setShowCheckInCalendar(false);
                setShowCheckOutCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    useEffect(() => {
        const checkAvailability = async () => {
            if (selectedDate && checkOut) {
                if (selectedDate.toISOString().split('T')[0] === checkOut.toISOString().split('T')[0]) {
                    setError('La fecha de ingreso no puede ser igual a la de salida.');
                    setIsAvailable(false);
                    return;
                }
                try {
                    const response = await fetch('https://three-2cs3.onrender.com/api/reservations/check-availability', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            checkIn: selectedDate.toISOString().split('T')[0],
                            checkOut: checkOut.toISOString().split('T')[0],
                            roomId: room.id,
                        }),
                    });
                    const data = await response.json();
                    setError('');
                    setIsAvailable(!data.unavailableRooms?.includes(room.id));
                } catch (error) {
                    console.error('Error al verificar disponibilidad:', error);
                    setIsAvailable(false);
                }
            }
        };
        checkAvailability();
    }, [selectedDate, checkOut, room.id]);

    // Tus funciones handler originales no se modifican
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckInChange = (date) => {
        setSelectedDate(date);
        setShowCheckInCalendar(false);
        if (!checkOut || date.getTime() >= checkOut.getTime()) {
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            setCheckOut(nextDay);
        }
        refreshPaypalButton();
    };

    const handleCheckOutChange = (date) => {
        setCheckOut(date);
        setShowCheckOutCalendar(false);
        refreshPaypalButton();
    };
    
    // --- CAMBIO 2: Se REEMPLAZA esta función para que use los datos actualizados ---
    const handlePaymentSuccess = async (details) => {
        const currentFormData = formDataRef.current; // Lee los datos frescos de la "caja"

        const { clientName, rutOrPassport, phone, nationality, address } = currentFormData;
        if (!clientName || !rutOrPassport || !phone || !nationality || !address) {
            alert('Por favor, completa todos los campos del formulario para registrar la reserva pagada.');
            return;
        }
      
        const reservationData = {
            roomId: room.id,
            clientName: currentFormData.clientName,
            clientName2: selectedOption === 2 ? currentFormData.clientName2 : undefined,
            clientEmail: currentFormData.clientEmail || undefined,
            rutOrPassport: currentFormData.rutOrPassport,
            numberOfGuests: selectedOption,
            checkIn: selectedDate?.toISOString().split('T')[0],
            checkOut: checkOut?.toISOString().split('T')[0],
            phone: currentFormData.phone,
            nationality: currentFormData.nationality,
            address: currentFormData.address,
            nights: calculateNights(),
            totalCost: calculateTotalPrice(),
            paymentMethod: 'PayPal',
            paymentStatus: 'pagado',
            transactionId: details.id,
        };
        try {
            const response = await fetch('https://three-2cs3.onrender.com/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservationData),
            });
            if (response.ok) {
                navigate('/success', { state: { reservation: reservationData } });
            } else {
                const result = await response.json();
                alert(`El pago fue exitoso, pero hubo un error al guardar la reserva: ${result.message}`);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('El pago fue exitoso, pero hubo un error al conectar con el servidor para guardar la reserva.');
        }
    };
    // --- FIN DEL CAMBIO 2 ---

    // El resto de tus funciones no se modifican
    const handleConfirmReservation = async (e) => {
        e.preventDefault();
        const reservationData = {
            roomId: room.id,
            clientName: formData.clientName,
            clientName2: selectedOption === 2 ? formData.clientName2 : undefined,
            clientEmail: formData.clientEmail || undefined,
            rutOrPassport: formData.rutOrPassport,
            numberOfGuests: selectedOption,
            checkIn: selectedDate?.toISOString().split('T')[0],
            checkOut: checkOut?.toISOString().split('T')[0],
            phone: formData.phone,
            nationality: formData.nationality,
            address: formData.address,
            nights: calculateNights(),
            totalCost: calculateTotalPrice(),
            paymentMethod: 'En Hostal',
            paymentStatus: 'pendiente',
        };
        console.log("Enviando al backend:", reservationData);
        try {
            const response = await fetch('https://three-2cs3.onrender.com/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservationData),
            });
            if (response.ok) {
                navigate('/success', { state: { reservation: reservationData } });
            } else {
                const result = await response.json();
                alert(`Error al realizar la reserva: ${result.message}`);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('Hubo un error al conectar con el servidor.');
        }
    };

    const exchangeRate = 900;
    const calculateNights = () => { if (!selectedDate || !checkOut) return 0; return Math.ceil((checkOut - selectedDate) / (1000 * 60 * 60 * 24)); };
    const convertToUSD = (amountInCLP) => { return (amountInCLP / exchangeRate).toFixed(2); };
    const calculateTotalPrice = () => { const nights = calculateNights(); const pricePerNight = selectedOption === 1 ? room.priceForOne : room.priceForTwo; return nights * pricePerNight; };
    const calculateTotalPriceInUSD = () => { const totalInCLP = calculateTotalPrice(); return convertToUSD(totalInCLP); };
    const roomImages = (room.images && Array.isArray(room.images) && room.images.length > 0) ? room.images : [room.image];
    const lightboxSlides = roomImages.map(imgSrc => ({ src: imgSrc }));

    if (!room) { return <div>Habitación no encontrada</div> }

    // Tu JSX permanece exactamente igual
    return (
        <div style={{ padding: '30px', textAlign: 'center', fontSize: '12px', }}>
            <h1 style={{ display: 'inline-block', padding: '10px 20px', fontSize: '15px', fontWeight: 'bold', color: 'white', backgroundColor: '#007bff', border: '2px solidrgb(255, 255, 255)', borderRadius: '20px', textAlign: 'center', cursor: 'default' }}>{room.type}</h1>
            <p><strong>ID:</strong> {room.id}</p>
            <div style={{ marginTop: '10px', fontSize: '15px', }}>
                <h2>Selecciona tus fechas</h2>
                <div style={{ marginBottom: '20px' }}><div ref={checkInRef} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '30px', cursor: 'pointer', backgroundColor: '#f9f9f9', position: 'relative' }} onClick={() => setShowCheckInCalendar((prev) => !prev)}> {selectedDate ? selectedDate.toLocaleDateString('es-ES') : 'Selecciona fecha de ingreso'} {showCheckInCalendar && (<div className="react-calendar" style={{ position: 'absolute', zIndex: 10 }} onClick={(e) => e.stopPropagation()}><Calendar onClickDay={(date) => { handleCheckInChange(date); setShowCheckInCalendar(false); }} value={selectedDate} locale="es-ES" minDate={new Date()} /></div>)}</div></div>
                <div style={{ marginBottom: '20px' }}><div ref={checkOutRef} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '20px', cursor: 'pointer', backgroundColor: '#f9f9f9', position: 'relative' }} onClick={() => setShowCheckOutCalendar((prev) => !prev)}> {checkOut ? checkOut.toLocaleDateString('es-ES') : 'Selecciona fecha de salida'} {showCheckOutCalendar && (<div className="react-calendar" style={{ position: 'absolute', zIndex: 10 }} onClick={(e) => e.stopPropagation()}><Calendar onClickDay={(date) => { handleCheckOutChange(date); setShowCheckOutCalendar(false); }} value={checkOut} locale="es-ES" minDate={selectedDate ? new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000) : new Date()} /></div>)}</div></div>
                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                {selectedDate && checkOut && !error && (<p style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold', color: isAvailable ? '#28a745' : '#dc3545', textAlign: 'center' }}>{isAvailable ? '¡Disponible!' : 'No disponible'}</p>)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ flex: 1, textAlign: 'center' }}><p style={{ margin: 0, fontSize: '0.8em', fontWeight: 'bold' }}>Precio por Noche</p><p style={{ margin: 0, fontSize: '0.7em' }}>{selectedOption === 1 ? `${room.priceForOne} CLP` : `${room.priceForTwo} CLP`}</p><p style={{ margin: 0, fontSize: '0.7em' }}>($ {selectedOption === 1 ? convertToUSD(room.priceForOne) : convertToUSD(room.priceForTwo)} USD)</p></div>
                <div style={{ flex: 1, maxWidth: '250px', margin: '0 auto' }}><Carousel showThumbs={false} infiniteLoop={true} autoPlay={true} interval={3000} showStatus={false} onClickItem={(index) => { setCurrentImageIndex(index); setLightboxOpen(true); }}>{roomImages.map((imgSrc, index) => (<div key={index} style={{ cursor: 'pointer' }}><img src={imgSrc} alt={`${room.type} - Imagen ${index + 1}`} style={{ borderRadius: '8px' }} /></div>))}</Carousel></div>
                <div style={{ flex: 1, textAlign: 'left', minHeight: '60px' }}>{selectedDate && checkOut && (<div><p style={{ margin: 0, fontWeight: 'bold' }}>Noches: {calculateNights()}</p><p style={{ margin: 0, fontWeight: 'bold' }}>Total: {calculateTotalPrice()} CLP</p><p style={{ margin: 0, fontSize: '0.8em' }}>($ {calculateTotalPriceInUSD()} USD)</p></div>)}</div>
            </div>
            <label>Personas:<select value={selectedOption} onChange={(e) => { setSelectedOption(parseInt(e.target.value)); refreshPaypalButton(); }} style={{ marginLeft: '20px', padding: '7px', fontSize: '12px', borderRadius: '10px', border: '1px solid #ddd' }}><option value={1}>1 Persona</option>{room.priceForTwo && <option value={2}>2 Personas</option>}</select></label>
            <div style={{ marginBottom: '20px' }}><button onClick={() => navigate(-1)} style={{ padding: '10.2px 30px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '18px', marginRight: '20px' }}>Volver</button><button disabled={!selectedDate || !checkOut || !isAvailable} onClick={() => setShowForm(true)} style={{ padding: '11px 20px', backgroundColor: !selectedDate || !checkOut || !isAvailable ? '#ccc' : '#28a745', color: !selectedDate || !checkOut || !isAvailable ? '#666' : '#fff', border: '100px', borderRadius: '50px', cursor: !selectedDate || !checkOut || !isAvailable ? 'not-allowed' : 'pointer', fontSize: '16px' }}>Reservar</button></div>
            
            {showForm && (
                <form onSubmit={(e) => e.preventDefault()} style={{ marginTop: '20px', textAlign: 'left', maxWidth: '600px', margin: '20px auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <h3>Formulario de Reserva</h3>
                    <label>Nombre completo:</label>
                    <input type="text" name="clientName" value={formData.clientName} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px' }} />
                    {selectedOption === 2 && (<>
                        <label>Nombre completo (Persona 2):</label>
                        <input type="text" name="clientName2" value={formData.clientName2} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px' }} />
                    </>)}
                    <label>RUT o número de pasaporte:</label>
                    <input type="text" name="rutOrPassport" value={formData.rutOrPassport} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px' }} />
                    <label>Correo electrónico (opcional):</label>
                    <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleInputChange} style={{ width: '100%', marginBottom: '10px' }} />
                    <label>Teléfono:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px' }} />
                    <label>Nacionalidad:</label>
                    <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px' }} />
                    <label>Dirección:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required style={{ width: '100%', marginBottom: '10px' }} />
                    <p>Cantidad de noches: <strong>{calculateNights()}</strong></p>
                    <p>Precio total: <strong>{calculateTotalPrice()} CLP</strong></p>
                    <div>
                        <h3>Total a pagar: {calculateTotalPrice()} CLP ($ {calculateTotalPriceInUSD()} USD)</h3>
                        <div className="payment-section">
                            <PaypalButton
                                key={paypalKey}
                                amount={calculateTotalPriceInUSD()}
                                onPaymentSuccess={handlePaymentSuccess}
                                onPaymentError={(error) => { alert('Hubo un error al procesar el pago. Por favor, inténtalo nuevamente.'); console.error('Error en el pago:', error); }}
                                onPaymentCancel={() => { alert('El pago fue cancelado por el usuario.'); }}
                            />
                            <p style={{ marginTop: '20px', fontWeight: 'bold' }}>También puedes confirmar tu reserva sin realizar un pago en línea.</p>
                            <button
                                ref={confirmReservationRef}
                                className="confirm-reservation-btn"
                                onClick={handleConfirmReservation}
                                style={{ marginTop: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Confirmar Reserva
                            </button>
                        </div>
                    </div>
                </form>
            )}
            <Lightbox open={isLightboxOpen} close={() => setLightboxOpen(false)} slides={lightboxSlides} index={currentImageIndex} />
        </div>
    );
};

export default RoomDetails;