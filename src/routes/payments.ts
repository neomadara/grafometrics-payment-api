import { Router, Request, Response } from 'express';
import PaymentsRepositoryMongo from '../repositories/paymentsRepositoryMongo';
import CreatePaymentUseCase from '../usecases/createPaymentUseCase';
import ProcessWebhookUseCase from '../usecases/processWebhookUseCase';
import { mpService } from '../infra/mercadopago';

/**
 * Arquitectura simplificada basada en casos de uso:
 * - No hay controllers; las rutas llaman directamente a los use-cases.
 * - El repositorio se instancia una sola vez y se comparte.
 */

const router = Router();

// Infra + repos
const repo = new PaymentsRepositoryMongo();

router.get('/pagos', async (_req: Request, res: Response) => {
	try {
		const pagos = await repo.findAll();
		res.json(pagos);
	} catch (err: any) {
		console.error('Error listando pagos:', err);
		res.status(500).json({ error: err.message || 'error listing payments' });
	}
});

router.post('/create', async (req: Request, res: Response) => {
	try {
		// Verificar que mpService esté inicializado
		if (!mpService) {
			return res.status(500).json({ 
				success: false, 
				error: 'MercadoPago service not initialized' 
			});
		}

		const createUseCase = new CreatePaymentUseCase(repo, mpService);
		const payload = req.body;
		const result = await createUseCase.execute(payload);
		res.status(201).json({ success: true, data: result });
	} catch (err: any) {
		console.error('Error creando payment:', err);
		res.status(400).json({ success: false, error: err.message || 'create payment failed' });
	}
});

router.post('/webhooks/mercadopago', async (req: Request, res: Response) => {
	const id = (req.query.id as string) || req.body?.data?.id || req.body?.id;
	if (!id) return res.status(400).send('missing id');

	try {
		// Verificar que mpService esté inicializado
		if (!mpService) {
			return res.status(500).json({ 
				success: false, 
				error: 'MercadoPago service not initialized' 
			});
		}

		const webhookUseCase = new ProcessWebhookUseCase(repo, mpService);
		const updated = await webhookUseCase.execute(String(id));
		res.status(200).json({ ok: true, updated });
	} catch (err: any) {
		console.error('Error procesando webhook:', err);
		res.status(500).send('error');
	}
});

export default router;
