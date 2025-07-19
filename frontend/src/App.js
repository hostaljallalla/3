import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// AÑADE SOLO ESTA LÍNEA
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import Home from './pages/Home';
import RoomDetails from './pages/RoomDetails';
import ReservationSuccess from './pages/ReservationSuccess';
import AdminPanel from './pages/AdminPanel';
import Nosotros from './pages/Nosotros';
import Galeria from './pages/Galeria';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
    return (
        <PayPalScriptProvider
            options={{
                "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
                currency: "USD",
                "enable-funding": "card",
            }}
        >
            <Router>
                <Header />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/room/:id" element={<RoomDetails />} />
                    <Route path="/success" element={<ReservationSuccess />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/galeria" element={<Galeria />} />
                </Routes>

                <Footer />
            </Router>
        </PayPalScriptProvider>
    );
};

export default App;