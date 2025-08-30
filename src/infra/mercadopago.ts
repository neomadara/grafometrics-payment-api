import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

export class MercadoPagoService {
  private client: MercadoPagoConfig;
  public preference: Preference;
  public payment: Payment;

  constructor(accessToken?: string) {
    const token = accessToken || process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    if (!token) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN es requerido');
    }

    this.client = new MercadoPagoConfig({ 
      accessToken: token,
      options: {
        timeout: 5000,
        idempotencyKey: 'abc'
      }
    });

    this.preference = new Preference(this.client);
    this.payment = new Payment(this.client);
  }

  // Crear preferencia de pago
  async createPreference(items: any[], payer?: any, backUrls?: any, externalReference?: string) {
    try {
      const body = {
        items,
        payer,
        back_urls: backUrls,
        external_reference: externalReference,
        auto_return: 'approved',
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12
        },
        notification_url: process.env.WEBHOOK_URL
      };

      const response = await this.preference.create({ body });
      return response;
    } catch (error) {
      console.error('Error creando preferencia:', error);
      throw error;
    }
  }

  // Obtener información de pago
  async getPayment(paymentId: string) {
    try {
      const payment = await this.payment.get({ id: paymentId });
      return payment;
    } catch (error) {
      console.error('Error obteniendo pago:', error);
      throw error;
    }
  }

  // Buscar pagos
  async searchPayments(filters: any) {
    try {
      const payments = await this.payment.search({ options: filters });
      return payments;
    } catch (error) {
      console.error('Error buscando pagos:', error);
      throw error;
    }
  }

  // Verificar estado de pago
  async verifyPaymentStatus(paymentId: string) {
    try {
      const payment = await this.getPayment(paymentId);
      return {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        transaction_amount: payment.transaction_amount,
        date_created: payment.date_created
      };
    } catch (error) {
      console.error('Error verificando estado de pago:', error);
      throw error;
    }
  }
}

// Instancia global
export let mpService: MercadoPagoService;

export function initMercadoPago(token?: string) {
  try {
    mpService = new MercadoPagoService(token);
    console.log('MercadoPago inicializado correctamente');
    return mpService;
  } catch (error) {
    console.error('Error inicializando MercadoPago:', error);
    throw error;
  }
}
