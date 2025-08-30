# CreatePaymentUseCase

Caso de uso para crear pagos utilizando MercadoPago. Este servicio maneja la creación de preferencias de pago y persiste la información en la base de datos.

## Descripción

El `CreatePaymentUseCase` es responsable de:
- Crear preferencias de pago en MercadoPago
- Validar los datos de entrada
- Persistir la información del pago en la base de datos
- Retornar las URLs de pago y datos relevantes

## Constructor

```typescript
constructor(repo: PaymentsRepository, mpClient: any)
```

### Parámetros

- `repo: PaymentsRepository` - Repositorio para persistir los datos de pago
- `mpClient: any` - Cliente de MercadoPago para interactuar con su API

## Método Principal

### execute(payload: CreatePayload)

Ejecuta la creación de un pago.

#### Parámetros

```typescript
type CreatePayload = {
  amount: number;           // Monto del pago (requerido)
  title?: string;          // Título del producto/servicio (opcional)
  external_reference?: string; // Referencia externa (opcional)
  payer?: { email?: string };  // Información del pagador (opcional)
}
```

#### Validaciones

- `amount` debe ser un número válido y es obligatorio

#### Comportamiento

1. **Validación**: Verifica que el monto sea válido
2. **Configuración por defecto**: 
   - `title` por defecto: "Pago Grafometrics"
   - `external_reference` por defecto: `gm-{timestamp}`
3. **Creación de preferencia**: Configura la preferencia en MercadoPago con:
   - URLs de retorno (success, failure, pending)
   - Auto-retorno en aprobación
   - Información del pagador
4. **Persistencia**: Guarda el registro en la base de datos
5. **Respuesta**: Retorna información del pago creado

#### Retorna

```typescript
{
  preference_id: string;        // ID de la preferencia en MercadoPago
  init_point: string;          // URL de pago para producción
  sandbox_init_point: string;  // URL de pago para sandbox
  record: PaymentRecord;       // Registro guardado en la base de datos
}
```

#### Errores

- Lanza `Error` si `amount` no es proporcionado o no es un número

## Configuración de Variables de Entorno

```bash
BACK_URL_SUCCESS=https://tu-front/checkout/success
BACK_URL_FAILURE=https://tu-front/checkout/failure  
BACK_URL_PENDING=https://tu-front/checkout/pending
```

## Ejemplo de Uso

```typescript
const createPaymentUseCase = new CreatePaymentUseCase(paymentsRepo, mpClient);

const result = await createPaymentUseCase.execute({
  amount: 1500,
  title: "Licencia Grafometrics Pro",
  external_reference: "user-123",
  payer: {
    email: "usuario@example.com"
  }
});

console.log(result.init_point); // URL para redirigir al usuario
```

## Notas de Desarrollo

- **TODO**: El `external_reference` debería ser el ID del usuario
- **TODO**: Solicitar al usuario cuánto va a pagar por la licencia
- El servicio está preparado para manejar tanto entorno de producción como sandbox

## Dependencias

- MercadoPago SDK
- PaymentsRepository interface
- Variables de entorno para URLs de retorno

## Estructura del Registro Guardado

```typescript
{
  id: string;              // ID de la preferencia
  preference_id: string;   // ID de la preferencia (duplicado por compatibilidad)
  external_reference: string; // Referencia externa
  amount: number;          // Monto del pago
  status: 'pending';       // Estado inicial del pago
  created_at: string;      // Timestamp de creación (ISO