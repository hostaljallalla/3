const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
app.use(express.json());

// ✅ CORS: permitir peticiones desde Netlify Y localhost
const allowedOrigins = [
  'https://hostaljallalla.netlify.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // permite Postman y pruebas sin origen
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("No permitido por CORS"));
    }
  }
}));

// 🔗 Conexión a MongoDB con tiempos de espera aumentados
mongoose
  .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
  })
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// 👀 Middleware para ver las solicitudes en consola
app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.originalUrl}`);
    next();
});

// 🚀 Ruta para confirmar que el servidor está vivo (opcional)
app.get('/', (req, res) => {
  res.send('Servidor de reservas funcionando en Render ✅');
});

// 📦 Rutas de reservas
console.log('Rutas cargadas: /api/reservations');
app.use('/api/reservations', reservationRoutes);

// 🚪 Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

