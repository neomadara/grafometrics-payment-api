import type PaymentsRepository from '../repositories/paymentsRepositoryInterface';
import type { MercadoPagoService } from '../infra/mercadopago';

type CreatePayload = {
  amount: number;
  title?: string;
  external_reference?: string;
  payer?: { email?: string };
};

export default class CreatePaymentUseCase {
  public repo: PaymentsRepository;
  private mp: MercadoPagoService;

  constructor(repo: PaymentsRepository, mpClient: MercadoPagoService) {
    this.repo = repo;
    this.mp = mpClient;
  }

  // TODO: el external_reference deberia ser el id del usuario ! 
  // TODO:: pedir cuanto va a pagar el usuario por la licencia

  /*
  input; id del usuario que va a pagar para referencia externa 

  */

  async execute(payload: CreatePayload) {
    const { amount, title = 'Pago Grafometrics', external_reference, payer } = payload;
    if (!amount || typeof amount !== 'number') throw new Error('amount is required (number)');

    const items = [
      {
        title,
        quantity: 1,
        unit_price: Number(amount),
        currency_id: 'CLP' // Añadir currency_id requerido
      },
    ];

    const backUrls = {
      success: process.env.BACK_URL_SUCCESS || 'https://tu-front/checkout/success',
      failure: process.env.BACK_URL_FAILURE || 'https://tu-front/checkout/failure',
      pending: process.env.BACK_URL_PENDING || 'https://tu-front/checkout/pending',
    };

    const payerData = payer || undefined;
    const externalReference = external_reference || `gm-${Date.now()}`;

    const response = await this.mp.createPreference(items, payerData, backUrls, externalReference);

    const saved = await this.repo.save({
      id: response.id,
      preference_id: response.id,
      external_reference: externalReference,
      amount,
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    return {
      preference_id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
      record: saved,
    };
  }
}
