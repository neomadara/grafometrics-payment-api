import express from 'express';
import paymentsRouter from './routes/payments';
import { initMercadoPago } from './infra/mercadopago';

export default function createApp() {
  const app = express();
  app.use(express.json());

  // Inicializar MercadoPago
  try {
    initMercadoPago(process.env.MERCADOPAGO_ACCESS_TOKEN || '');
    console.log('✅ MercadoPago inicializado correctamente');
  } catch (error) {
    console.error('❌ Error inicializando MercadoPago:', error);
  }

  // Health check
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Grafometrics Payment API',
      status: 'running',
      timestamp: new Date().toISOString()
    });
  });

  // Routes
  app.use('/payments', paymentsRouter);

  return app;
}
