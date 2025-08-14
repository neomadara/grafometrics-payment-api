import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta de ejemplo
app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola, mundo!');
});

// Ruta para obtener pagos
app.get('/pagos', (req: Request, res: Response) => {
  res.json([{ id: 1, monto: 100 }, { id: 2, monto: 200 }]);
});

// Ruta para crear un pago
app.post('/pagos', (req: Request, res: Response) => {
  const nuevoPago = req.body;
  // Aquí normalmente guardarías el pago en la base de datos
  res.status(201).json({ mensaje: 'Pago creado', pago: nuevoPago });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
