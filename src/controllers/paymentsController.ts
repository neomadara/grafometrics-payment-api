import { Request, Response } from 'express';
import CreatePaymentUseCase from '../usecases/createPaymentUseCase';
import ProcessWebhookUseCase from '../usecases/processWebhookUseCase';

export default class PaymentsController {
  constructor(
    private createPaymentUseCase: CreatePaymentUseCase,
    private processWebhookUseCase: ProcessWebhookUseCase
  ) {}

  health(req: Request, res: Response) {
    res.send('¡Hola, soy la pasarela de pagos de Grafometrics!');
  }

  async list(req: Request, res: Response) {
    const pagos = await this.createPaymentUseCase.repo.findAll();
    res.json(pagos);
  }

  async create(req: Request, res: Response) {
    try {
      const payload = req.body;
      const result = await this.createPaymentUseCase.execute(payload);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'create payment failed' });
    }
  }

  async webhook(req: Request, res: Response) {
    const id = (req.query.id as string) || req.body?.data?.id || req.body?.id;
    if (!id) return res.status(400).send('missing id');

    try {
      await this.processWebhookUseCase.execute(String(id));
      res.status(200).send('ok');
    } catch (err: any) {
      console.error('Webhook handling error:', err);
      res.status(500).send('error');
    }
  }
}
