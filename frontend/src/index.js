// Contenido para src/index.js

import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot
import App from './App';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import './index.css';

const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

const container = document.getElementById('root');
const root = createRoot(container); // Crea el root

root.render(
    <React.StrictMode>
        <PayPalScriptProvider options={{ "client-id": clientId, currency: "USD" }}>
            <App />
        </PayPalScriptProvider>
    </React.StrictMode>
);