// Contenido completo y simplificado para PaypalButton.js

import React from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

// El botón ya no necesita 'reservationDetails'. Solo las funciones de callback.
export default function PaypalButton({ amount, onPaymentSuccess, onPaymentError, onPaymentCancel }) {
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    // Ya no hay validación aquí. Simplemente crea la orden con el monto.
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount,
            currency_code: "USD",
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      // Cuando el pago es exitoso, simplemente llama a la función onPaymentSuccess.
      // RoomDetails.js se encargará del resto.
      onPaymentSuccess(details); 
    }).catch((error) => {
      onPaymentError(error);
    });
  };

  return (
    <div>
      {isPending ? (
        <p>Cargando...</p>
      ) : (
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onCancel={onPaymentCancel}
          style={{ layout: "vertical" }}
        />
      )}
    </div>
  );
}