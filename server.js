const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB con tiempos de espera aumentados
mongoose
  .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Espera hasta 30 segundos para la conexión
      socketTimeoutMS: 45000,         // Tiempo de espera para operaciones
  })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Middleware para ver las solicitudes
app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.originalUrl}`);
    next();
});

// Rutas
console.log('Rutas cargadas: /api/reservations');
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));








