import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReservationSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const reservation = location.state?.reservation;

    if (!reservation) {
        return <p>No se encontraron detalles de la reserva.</p>;
    }

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20; // Posición inicial vertical

        // Agregar logo
        doc.addImage('/images/success.jpg', 'JPEG', 10, 10, 30, 30);

        // Título centrado
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("Confirmación de Reserva", pageWidth / 2, y, { align: "center" });
        y += 20;

        // Información del cliente y reserva
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Nombre del Cliente: ${reservation.clientName}`, 10, y);
        doc.text(`Teléfono: ${reservation.phone || 'No disponible'}`, 10, y + 10);
        doc.text(`Cantidad de Personas: ${reservation.numberOfGuests}`, 10, y + 20);
        y += 30;

        // Crear tabla con detalles de la reserva
        const tableColumn = [
            "Detalle",
            "Información",
        ];

        const tableRows = [
            ["Habitación", reservation.roomId],
            ["Fecha de Ingreso", new Date(reservation.checkIn).toLocaleDateString()],
            ["Fecha de Salida", new Date(reservation.checkOut).toLocaleDateString()],
            ["Cantidad de Noches", reservation.nights],
            ["Costo Total", `${reservation.totalCost.toLocaleString()} CLP`],
        ];

        doc.autoTable({
            startY: y,
            head: [tableColumn],
            body: tableRows,
            styles: { fontSize: 10 },
            columnStyles: { 1: { halign: "right" } }, // Alinear segunda columna a la derecha
            margin: { left: 10, right: 10 },
        });

        // Pie de página
        const footerY = doc.internal.pageSize.getHeight() - 20;
        doc.setFontSize(10);
        doc.text("Gracias por confiar en Hostal Jallalla. ¡Te esperamos!", pageWidth / 2, footerY, { align: "center" });

        // Guardar el PDF
        doc.save('Confirmacion_Reserva.pdf');
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ color: 'green' }}>¡Felicidades!</h1>
            <p>Tu reserva ha sido realizada exitosamente.</p>
            <img
                src="/images/success.jpg"
                alt="Reserva Exitosa"
                style={{
                    width: '300px',
                    margin: '20px 0',
                    borderRadius: '15px'
                }}
            />
            <p>
                <strong>Detalles de la Reserva:</strong>
            </p>
            <ul style={{ listStyle: 'none', textAlign: 'left', display: 'inline-block' }}>
                <li>ID de la Habitación: {reservation.roomId}</li>
                <li>Nombre del Cliente: {reservation.clientName}</li>
                <li>Cantidad de Personas: {reservation.numberOfGuests}</li>
                <li>Fecha de Ingreso: {reservation.checkIn}</li>
                <li>Fecha de Salida: {reservation.checkOut}</li>
                <li>Cantidad de Noches: {reservation.nights}</li>
                <li>Costo Total: {reservation.totalCost.toLocaleString()} CLP</li>
            </ul>
            <button
                onClick={() => navigate('/')}
                style={{
                    marginRight: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Volver
            </button>
            <button
                onClick={handleDownloadPDF}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Descargar PDF
            </button>
        </div>
    );
};

export default ReservationSuccess;

