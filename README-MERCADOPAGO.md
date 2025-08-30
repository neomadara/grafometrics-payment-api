# Grafometrics Payment API - Guía de Implementación MercadoPago

## Configuración Actualizada

La API ahora utiliza la **nueva SDK de MercadoPago v2.4.0** con las siguientes mejoras:

### ✅ Cambios Implementados

1. **Clase MercadoPagoService**: Reemplaza la implementación legacy con una clase moderna
2. **Tipado TypeScript**: Mejor tipado y autocompletado
3. **Manejo de Errores**: Gestión mejorada de errores
4. **Métodos Simplificados**: API más limpia y fácil de usar

### 🔧 Configuración de Variables de Entorno

Copia `.env.example` a `.env` y configura:

```bash
# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-sandbox-token  # Token de sandbox o producción

# Webhook para notificaciones
WEBHOOK_URL=https://tu-dominio.com/webhook

# URLs de retorno después del pago
BACK_URL_SUCCESS=https://tu-frontend.com/payment/success
BACK_URL_FAILURE=https://tu-frontend.com/payment/failure
BACK_URL_PENDING=https://tu-frontend.com/payment/pending

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=grafometrics
```

### 📝 Uso de la API

#### Crear un Pago

```bash
POST /crear-pago
Content-Type: application/json

{
  "amount": 1000,
  "title": "Licencia Grafometrics",
  "external_reference": "user-123",
  "payer": {
    "email": "user@example.com"
  }
}
```

#### Respuesta

```json
{
  "preference_id": "1234567890-abc123-def456",
  "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...",
  "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=...",
  "record": {
    "id": "1234567890-abc123-def456",
    "status": "pending",
    "amount": 1000,
    "created_at": "2025-08-29T..."
  }
}
```

### 🔄 Webhooks

La API maneja automáticamente los webhooks de MercadoPago en `/webhook`. Los pagos se actualizan automáticamente cuando cambia su estado.

### 🚀 Inicialización

El servicio se inicializa automáticamente en `app.ts`:

```typescript
import { initMercadoPago } from './infra/mercadopago';

// Se inicializa con el token del .env
initMercadoPago();
```

### 📦 Dependencias

- `mercadopago: ^2.4.0` - SDK oficial actualizada
- `express: ^5.1.0`
- `mongodb: ^5.7.0`
- `typescript: ^5.0.0`

### 🔍 Métodos Disponibles

La clase `MercadoPagoService` ofrece:

- `createPreference()` - Crear preferencia de pago
- `getPayment()` - Obtener información de un pago
- `searchPayments()` - Buscar pagos con filtros
- `verifyPaymentStatus()` - Verificar estado de pago

### ⚡ Migración Completada

✅ Reemplazada implementación legacy  
✅ Actualizada SDK a v2.4.0  
✅ Corregidos tipos TypeScript  
✅ Mejorado manejo de errores  
✅ Actualizado use cases  
✅ Configuración centralizada

La API está lista para usar con la nueva implementación de MercadoPago.
