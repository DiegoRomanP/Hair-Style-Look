# Cuestionario V1 del MVP

## Objetivo

Recoger solo tres datos para controlar la simulacion, sin inferir salud, genero, etnia, rasgos faciales ni atributos sensibles.

## Campos obligatorios

| Codigo | Pregunta visible | Contrato |
|---|---|---|
| `style` | ¿Que estilo quieres probar? | Un estilo del catalogo o texto libre de 3 a 120 caracteres |
| `currentLength` | ¿Cual describe mejor tu largo actual? | `very_short`, `short`, `medium`, `long` |
| `changeLevel` | ¿Que tanto cambio buscas? | `subtle`, `medium`, `radical` |

`style` es una eleccion exclusiva: `hairstyleId` o `customStyleText`, nunca ambos. El texto nuevo se normaliza, filtra y guarda en `style_suggestions` como recomendacion futura `pending`. No se publica automaticamente en el catalogo ni se pasa directamente al proveedor.

## Reglas

- Los tres campos son necesarios para generar.
- Solo se aceptan peinados para personas; no solicitudes generales de imagen.
- Una sugerencia repetida aumenta `occurrences` sin crear duplicados.
- Las respuestas describen preferencias, no un diagnostico.
- La version inicial del cuestionario es `1`.
- No pedir nombre, telefono, correo ni datos de salud en este recorrido.

## Supuesto explicitado

La peticion definio “tres campos” pero describio expresamente solo el campo Estilo. Para que el contrato sea implementable sin ampliar el formulario, se mantienen como segundo y tercer campo `currentLength` y `changeLevel`, que ya existian en el cuestionario previo y afectan directamente a la realizabilidad. Cambiar estos dos campos requiere una decision de producto, no una reescritura de arquitectura.

## Pendiente antes de datos reales

- Aprobar 12 a 20 estilos y sus referencias visuales.
- Confirmar las opciones visibles con el salon piloto.
