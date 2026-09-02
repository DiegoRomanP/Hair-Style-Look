# Politica tecnica de conservacion del MVP

> Borrador local, no politica legal definitiva.

## Eleccion del cliente

Antes de generar, el cliente elige:

- `keep_for_return`: conservar foto, resultados y ficha para volver mientras su sesion siga vigente.
- `delete_after_download`: permitir descarga y crear inmediatamente una solicitud de eliminacion.

El MVP debe ofrecer eliminacion manual en cualquier momento. La duracion maxima de `keep_for_return` no se inventa: se mantiene como decision pendiente y debe aprobarse antes de usar datos reales.

## Eliminacion

1. Verificar salon, sesion y asset.
2. Cambiar el asset de `ready` a `deleting` de forma condicional.
3. Eliminar el archivo del bucket GridFS.
4. Verificar que no existe.
5. Marcar `deleted` y retirar referencias de la ficha cuando corresponda.
6. Reintentar el paso tecnico de manera idempotente sin duplicar efectos.
7. Registrar solo un evento sanitizado.

Un reconciliador elimina uploads incompletos y binarios huerfanos. GridFS no permite una transaccion unica con la coleccion `assets`; los estados intermedios son obligatorios.

## Cuarentena

Solo un resultado generado por el proveedor que sea inadecuado puede ir a `moderation_assets`. No es visible al cliente, no se reutiliza y se elimina en un maximo de 24 horas. Una solicitud rechazada antes del proveedor conserva solo codigo, fecha e identificadores opacos.

## Limite externo

La eliminacion local no equivale a eliminar inmediatamente contenido de los sistemas de OpenAI. El consentimiento debe describir la politica vigente del proveedor y evitar promesas que la aplicacion no puede cumplir.
