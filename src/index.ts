import 'dotenv/config';
import createApp from './app';
import { connect as connectMongo } from './infra/mongodb';

const app = createApp();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'grafometrics';

connectMongo(MONGODB_URI, MONGODB_DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error', err));

export default app;
export const handler = (req: any, res: any) => app(req, res);

if (require.main === module) {
  app.listen(port, () => {
    console.log('Variables de entorno cargadas:');
    console.log('- MERCADOPAGO_ACCESS_TOKEN:', process.env.MERCADOPAGO_ACCESS_TOKEN ? 'Configurado' : 'No configurado');
    console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Configurado' : 'No configurado');
    console.log(`API escuchando en http://localhost:${port}`);
  });
}
