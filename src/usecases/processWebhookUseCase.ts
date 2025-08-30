import type PaymentsRepository from '../repositories/paymentsRepositoryInterface';
import type { MercadoPagoService } from '../infra/mercadopago';

export default class ProcessWebhookUseCase {
  constructor(private repo: PaymentsRepository, private mp: MercadoPagoService) {}

  async execute(id: string) {
    const payment = await this.mp.getPayment(id);

    const external_reference = payment.external_reference;
    const status = payment.status;

    const existing = await this.repo.findByExternalReference(external_reference);
    if (existing) {
      existing.status = status;
      existing.updated_at = new Date().toISOString();
      existing.raw = payment;
      await this.repo.update(existing);
      return existing;
    } else {
      const created = {
        id: payment.id || id,
        preference_id: payment.order?.id || null, // La nueva SDK usa order.id en lugar de preference_id
        external_reference,
        amount: payment.transaction_amount || null,
        status,
        created_at: new Date().toISOString(),
        raw: payment,
      };
      await this.repo.save(created);
      return created;
    }
  }
}
