const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.get('/pagos', (req, res) => {
  res.json([{ id: 1, monto: 100 }, { id: 2, monto: 200 }]);
});

app.post('/pagos', (req, res) => {
  const nuevoPago = req.body;
  // Aquí normalmente guardarías el pago en la base de datos
  res.status(201).json({ mensaje: 'Pago creado', pago: nuevoPago });
});

// Exporta el handler para Vercel
module.exports = app;
