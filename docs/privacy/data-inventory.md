# Inventario de datos del MVP local

> Borrador funcional. Requiere revision humana antes de usar fotografias reales.

| Dato | Finalidad | Persistencia del MVP | Acceso |
|---|---|---|---|
| Hash del token de sesion | Recuperar y limitar acceso anonimo | MongoDB hasta revocacion/expiracion | BFF y worker |
| Registro de consentimiento | Aplicar la puerta de acceso | MongoDB con version y fecha | Sesion y operador local |
| Tres respuestas | Controlar catalogo y generacion | MongoDB mientras se conserve la sesion | Sesion y operador local |
| Sugerencia de estilo | Evaluar futura incorporacion al catalogo | MongoDB, texto normalizado | Operador local |
| Foto de entrada | Editar el peinado | GridFS `input_assets` | Sesion, worker y proveedor |
| Resultado | Mostrar, descargar y crear ficha | GridFS `result_assets` | Sesion y operador local |
| Ficha | Conservar la eleccion | MongoDB | Sesion y operador local |
| Resultado ocultado | Investigar un fallo de seguridad | GridFS `moderation_assets`, maximo 24 h | Operador local solamente |
| Incidente sanitizado | Depurar limites/fallos | MongoDB con TTL | Operador local |
| Gasto | Detener al llegar a USD 10 | MongoDB en centavos | Worker y operador local |

## Prohibiciones

- No usar fotos para entrenamiento, reconocimiento o embeddings.
- No guardar fotos originales rechazadas en cuarentena.
- No incluir binarios, base64, cookies, tokens, prompts, rutas GridFS o texto libre completo en logs o Engram.
- No almacenar contacto, pagos o reservas en este MVP.
- No afirmar que almacenamiento local en Peru controla la retencion del proveedor externo.

## Pendiente bloqueante para personas reales

- duracion maxima de `keep_for_return`;
- responsable y encargado del tratamiento;
- texto legal final y retiro;
- region/transferencias del proveedor;
- procedimiento humano de incidente y soporte.
