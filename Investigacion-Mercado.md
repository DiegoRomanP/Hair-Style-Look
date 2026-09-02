# Investigación de mercado: asesoría capilar con IA para peluquerías

> Estado: investigación consolidada para validación y piloto  
> Fecha de corte: 18 de agosto de 2026  
> Mercado inicial: peluquerías y barberías de Lima, Perú  
> Modelo recomendado: B2B2C, utilizado en el salón o mediante un QR del salón

> Decisión de construcción del 30 de agosto de 2026: primero se hará un MVP local, no un sistema listo para producción. MongoDB Community y GridFS conservarán sesiones e imágenes; OpenAI Images será el proveedor normal con un presupuesto técnico máximo de USD 10. El benchmark entre proveedores queda como trabajo posterior y no condiciona el primer vertical slice.

## 1. Propósito del documento

Este documento reúne la investigación comercial, competitiva y de producto realizada para una aplicación de asesoría capilar asistida por inteligencia artificial. Su objetivo es servir como base para:

- Definir el posicionamiento del producto.
- Delimitar el MVP que será evaluado por una peluquería real.
- Evitar construir funciones que ya están comoditizadas o que todavía no han sido validadas.
- Identificar riesgos de mercado, confianza, privacidad y expectativas.
- Establecer hipótesis y métricas del piloto.

Las decisiones de arquitectura, stack, datos, seguridad y construcción se encuentran en [DevTech-MVP.md](./DevTech-MVP.md).

## 2. Resumen ejecutivo

El proyecto es viable, pero no debería posicionarse como otro generador de peinados para consumidores. La simulación de cortes y colores ya está cubierta por aplicaciones masivas, herramientas especializadas y APIs empresariales.

La oportunidad defendible es construir una herramienta de consulta para peluquerías que convierta una imagen atractiva en una decisión profesional ejecutable:

> De “quiero algo así” a una ficha de servicio aprobada por el estilista en menos de tres minutos.

La generación de imágenes será una capacidad intercambiable. El valor principal estará en:

- Eliminar la necesidad de escribir prompts.
- Presentar opciones que la peluquería realmente puede ejecutar.
- Considerar textura, largo actual, voluntad de cambio y mantenimiento.
- Reducir la incertidumbre del cliente.
- Estandarizar la conversación entre cliente y estilista.
- Producir una ficha con instrucciones, servicios, tiempo y precio.
- Mantener revisión humana antes de prometer un resultado.
- Tratar las fotografías faciales con privacidad desde el diseño.

La hipótesis comercial no es que una imagen generada sea suficiente. La hipótesis es que una consulta visual, guiada y aprobada profesionalmente mejora al menos una de estas variables:

- Tiempo de consulta.
- Conversión de consultas en servicios.
- Ticket promedio.
- Satisfacción con la decisión.
- Claridad de las expectativas.

## 3. Problema observado

Cuando una persona va a una peluquería o barbería puede llegar sin una decisión clara, con una referencia difícil de explicar o con expectativas que no consideran su cabello actual.

### 3.1 Problemas del cliente

- No sabe qué corte, color o acabado elegir.
- No puede visualizar el resultado sobre su propio rostro.
- Lleva fotografías de celebridades o modelos con textura, densidad o largo diferentes.
- Teme tomar una decisión irreversible.
- No sabe cuánto mantenimiento requerirá el look.
- Puede confundir una imagen generada con una promesa de resultado.

### 3.2 Problemas del estilista

- Debe traducir deseos ambiguos a instrucciones técnicas.
- Pierde tiempo buscando referencias o redactando prompts.
- Puede recibir una imagen imposible de reproducir con el cabello actual.
- Debe corregir expectativas sobre decoloración, densidad, volumen, largo y textura.
- No dispone siempre de una herramienta rápida en su dispositivo.
- Puede ofrecer servicios adicionales, pero sin un soporte visual consistente.

### 3.3 Problemas de las soluciones actuales

- Los filtros tradicionales pueden parecer pelucas digitales.
- Los generadores libres producen resultados impredecibles.
- Algunas herramientas alteran el rostro además del cabello.
- La cantidad de estilos puede generar más indecisión.
- La mayoría termina en una imagen, no en una ficha ejecutable.
- La retención y el tratamiento de fotografías no siempre son transparentes.

## 4. Oportunidad de producto

El producto puede actuar como una capa de consulta entre el cliente, el estilista y el motor de generación.

```text
Preferencias del cliente
        +
Catálogo y servicios del salón
        +
Simulación visual
        +
Validación del estilista
        =
Ficha de servicio realizable
```

La ventaja no debe medirse por el número de imágenes generadas, sino por la proporción de consultas que terminan con un look seleccionado y aprobado.

## 5. Metodología y límites de la investigación

La investigación se realizó mediante páginas oficiales, documentación de APIs, fichas públicas de aplicaciones y oferta pública de productos. Se compararon capacidades, audiencia, modelo de negocio, privacidad declarada y relación con el flujo profesional.

Limitaciones:

- Las cifras de usuarios, precisión, conversión y satisfacción son declaraciones de los proveedores.
- No se efectuó una auditoría independiente de calidad visual.
- Algunos precios pueden cambiar después de la fecha de corte.
- La disponibilidad de APIs y modelos depende de región, cuenta y contrato.
- Una demostración comercial no prueba consistencia en cabello peruano diverso.
- La existencia de una función no prueba que sea utilizada o valorada por salones locales.

## 6. Segmentos del mercado

### 6.1 Editores de belleza para consumidores

Ejemplos: Facetune y YouCam Makeup.

Fortalezas:

- Distribución masiva.
- Experiencia móvil refinada.
- Presets, color, prompts y retoque.
- Resultados rápidos y compartibles.

Debilidades frente al caso de uso:

- Orientados a autoedición y entretenimiento.
- No conocen los servicios ni limitaciones del salón.
- No entregan necesariamente instrucciones profesionales.
- Pueden fomentar resultados aspiracionales no ejecutables.

### 6.2 Generadores especializados de peinados

Ejemplos: HairTry y otras aplicaciones de “AI hairstyle try-on”.

Fortalezas:

- Flujo directo de subir foto y elegir look.
- Catálogos extensos.
- Diferentes colores, largos y vistas.
- Modelo de créditos fácil de comprender.

Debilidades:

- Poco contexto sobre la capacidad real del estilista.
- El volumen de estilos no garantiza una mejor decisión.
- Normalmente terminan en una descarga o comparación visual.
- Uso episódico, lo que dificulta una suscripción B2C recurrente.

### 6.3 APIs de prueba virtual

Ejemplo principal: Perfect Corp./YouCam API.

Fortalezas:

- Integración B2B.
- Plantillas predefinidas y referencias personalizadas.
- Validación de entrada.
- Capacidades especializadas en cabello.
- Escalamiento gestionado por el proveedor.

Debilidades:

- Dependencia del proveedor.
- Precio real sujeto a plan y negociación.
- Diferenciación limitada si varios competidores usan el mismo motor.
- Las capacidades empresariales pueden exceder el presupuesto del piloto.

### 6.4 Consulta profesional en salón

Ejemplo: L’Oréal Professionnel My Hair [iD].

Fortalezas:

- Une inspiración, prueba virtual, diagnóstico y recomendación.
- Se integra en una conversación profesional.
- Está asociado con productos y servicios reales.

Debilidades frente a un producto independiente:

- Ecosistema vinculado a una marca.
- Enfoque fuerte en color y líneas profesionales específicas.
- Menor neutralidad para un salón con múltiples marcas.

### 6.5 Sistemas operativos para barberías y salones

Ejemplo local: Kutu Barber con Ricuy AI.

Fortalezas:

- Oferta orientada a barberías peruanas.
- Agenda, ventas, clientes y fidelización.
- Escaneo facial, tipo de rostro, cortes sugeridos y referencia.
- Aplicación web instalable.

Debilidades y oportunidad:

- La comunicación pública se centra en recomendación y referencia, no necesariamente en una simulación generativa completa y validada por el estilista.
- Competir como sistema integral exigiría construir demasiadas funciones.
- La oportunidad es integrarse o especializarse en la consulta visual, no replicar agenda, caja e inventario.

## 7. Competidores relevantes

### 7.1 Perfect Corp./YouCam API

Audiencia: marcas de belleza, comercio electrónico, aplicaciones y salones.

Capacidades observadas:

- Biblioteca pública de más de 150 estilos.
- Estilos para diferentes presentaciones de género y tipos de cabello.
- Uso de `style_id` predefinido.
- Transferencia desde una imagen de referencia.
- Flujo asíncrono de creación de tarea y consulta de resultado.
- Validación de resolución, rostro y pose.
- Módulos separados para color, flequillo, extensión, volumen, tipo, largo y frizz.
- API REST y playground.

Lectura estratégica:

- Es el competidor tecnológico más directo.
- También es un proveedor potencial.
- Confirma que las plantillas controladas son más comercializables que prompts completamente libres.
- Obliga a diferenciar el producto en flujo, catálogo del salón, ficha y datos del piloto.

Fuentes:

- [AI Hairstyle API](https://yce.perfectcorp.com/es/ai-api/products/ai-hairstyle-api)
- [Guía de integración](https://docs.perfectcorp.com/reference/ai_hairstyle/section/overview/integration-guide)
- [Planes de API](https://yce.perfectcorp.com/ai-api/api-pricing)

### 7.2 L’Oréal Professionnel My Hair [iD]

Audiencia: profesionales y clientes de salones.

Capacidades observadas:

- Inspiraciones de color.
- Prueba virtual.
- Diagnóstico profesional.
- Recomendaciones de producto.
- Consulta dentro del salón.

Lectura estratégica:

- Valida la categoría de consulta profesional asistida.
- Demuestra que el valor aumenta cuando la simulación conduce a un servicio o producto.
- La solución propuesta debe ser neutral respecto a marcas y configurable por salón.

Fuente:

- [My Hair ID for Pros](https://us.lorealprofessionnel.com/my-hair-id-for-pros)

### 7.3 Facetune

Audiencia: consumidor general.

Capacidades observadas:

- Cambio de peinados y colores mediante selección directa.
- Presets y prompts personalizados.
- Ajustes de brillo, textura y detalles.
- Opciones para hombres y mujeres.
- Herramientas de análisis y retoque adyacentes.

Precio observado en la fecha de investigación:

- Prueba gratuita de siete días.
- Aproximadamente USD 13 por mes o USD 40 por trimestre según la página pública revisada.

Lectura estratégica:

- Competir por calidad de editor móvil sería costoso.
- El producto debe enfocarse en consulta, aprobación profesional y servicio real.

Fuente:

- [Virtual hairstyle and color try-on](https://www.facetuneapp.com/features/virtual-hair-color-and-style)

### 7.4 YouCam Makeup

Audiencia: consumidor general.

Capacidades observadas:

- Más de 60 peinados anunciados.
- Cambio de color.
- Transferencia desde fotografías de referencia o prompts.
- Ecosistema de edición de rostro, maquillaje y cuerpo.
- Aplicación gratuita con compras internas.

Lectura estratégica:

- Tiene distribución y amplitud imposibles de replicar en un MVP.
- Refuerza la decisión de no construir un editor de belleza generalista.

Fuente:

- [YouCam Makeup en App Store](https://apps.apple.com/us/app/youcam-makeup-face-editor/id863844475)

### 7.5 HairTry

Audiencia: consumidor interesado en visualizar cortes y colores.

Capacidades declaradas:

- Más de 1,000 estilos y colores.
- Selección de vista frontal, lateral, posterior o superior.
- Descripción libre del look.
- Referencias personalizadas.
- Recomendaciones por características faciales y tono de piel.
- Descarga y uso de la imagen con un estilista.
- Eliminación declarada de fotografías después de 14 días.

Precios observados:

- USD 4.99 por 20 créditos.
- USD 12.99 por 50 créditos.
- USD 29.99 por 120 créditos.
- Créditos con validez anunciada de 60 días.

Lectura estratégica:

- Es muy cercana a la idea original.
- Demuestra que “foto + catálogo + generación” no es diferenciación suficiente.
- Su almacenamiento de 14 días permite diferenciarse mediante eliminación más rápida y explícita.

Fuentes:

- [HairTry](https://hairtry.app/es)
- [HairTry Pricing](https://hairtry.app/pricing)

### 7.6 Kutu Barber/Ricuy AI

Audiencia: barberías peruanas.

Capacidades declaradas:

- Escaneo del rostro.
- Identificación de tipo de rostro y mandíbula.
- Recomendación de cortes.
- Fotografía de referencia.
- Agenda, clientes, ventas, equipo y fidelización.
- Aplicación web instalable.

Precios públicos observados:

- Plan Pro alrededor de S/74 por mes, con 30 escaneos de IA, según facturación anual mostrada en la fecha de investigación.
- Plan Elite alrededor de S/149 por mes, con 100 escaneos de IA, según facturación anual mostrada.

Lectura estratégica:

- Es la señal competitiva local más importante.
- El precio incluye muchas funciones operativas; una simulación aislada puede tener un techo de precio bajo.
- Para cobrar más, el producto debe demostrar impacto económico o especialización superior.
- No se recomienda competir inicialmente con agenda, ventas o fidelización.

Fuente:

- [Kutu Barber para barberías](https://kutubarber.com/para-barberias)

### 7.7 Hairgen.ai y otras herramientas adyacentes

Se identificaron APIs y aplicaciones adicionales de generación capilar, incluidas herramientas orientadas a trasplantes o simulaciones específicas. Confirman que la capacidad técnica puede adquirirse como servicio y que entrenar un modelo propio no es necesario para el MVP.

Fuente de referencia:

- [Hairgen.ai API](https://docs.hairgen.ai/api)

## 8. Matriz competitiva

La matriz utiliza información pública y debe validarse con pruebas reales.

| Capacidad | Facetune | YouCam Makeup | HairTry | Perfect Corp API | L’Oréal My Hair ID | Kutu Barber | Producto propuesto |
|---|---:|---:|---:|---:|---:|---:|---:|
| Simulación de corte | Sí | Sí | Sí | Sí | Parcial | Referencia/recomendación pública | Sí |
| Cambio de color | Sí | Sí | Sí | Sí | Sí | No destacado | Después del corte básico o limitado |
| Presets sin prompt | Sí | Sí | Sí | Sí | Sí | Sí | Sí |
| Referencia personalizada | Sí | Sí | Sí | Sí | Inspiraciones | Foto de referencia | Después del catálogo inicial |
| Flujo profesional en salón | Parcial | Parcial | Parcial | Integrable | Sí | Sí | Sí, foco principal |
| Catálogo por salón | No | No | No | Requiere integración | Vinculado a marca | No confirmado públicamente | Sí |
| Precio y duración reales | No | No | No | No | Ligado al servicio | Gestión general | Sí |
| Aprobación del estilista | No | No | No | No | Sí | No confirmado | Sí |
| Ficha de ejecución | No | No | No | No | Diagnóstico/recomendación | Ficha declarada | Sí |
| Eliminación elegida por el cliente | No confirmado | No confirmado | 14 días declarados | Depende del contrato | Depende del servicio | No confirmado | Descargar/eliminar o conservar para volver |
| Neutral respecto a marcas | Sí | Sí | Sí | Sí | No completamente | Sí | Sí |

## 9. Sustitutos y comportamiento actual

El producto también compite con soluciones no tecnológicas:

- Fotografías de Pinterest, Instagram o TikTok.
- Catálogos impresos o del propio salón.
- Búsqueda manual en Google.
- Consulta verbal con el estilista.
- Aplicaciones gratuitas de edición.
- Pelucas o muestras de color.
- Mensajes por WhatsApp antes de la cita.

La nueva solución debe ser más rápida que buscar referencias manualmente y más útil que enseñar una sola imagen inspiracional.

## 10. Segmento inicial recomendado

### Cliente comprador

Propietario o administrador de una peluquería/barbería mediana o premium que:

- Ofrece consultas de cambio de look.
- Tiene servicios de corte, color o tratamientos de mayor valor.
- Utiliza WhatsApp e Instagram para captar clientes.
- Está dispuesto a utilizar una tablet o QR.
- Puede designar al menos un estilista para revisar el catálogo.

### Usuario profesional

Estilista o barbero que necesita:

- Reducir preguntas ambiguas.
- Alinear expectativas.
- Contar con una referencia consistente.
- Explicar mantenimiento, tiempo y limitaciones.

### Usuario final

Cliente adulto que:

- Considera cambiar de look.
- Tiene incertidumbre sobre el resultado.
- Acepta tomar una fotografía con consentimiento informado.
- Valora una recomendación revisada por un profesional.

## 11. Posicionamiento recomendado

### Categoría

Asistente de consulta visual para peluquerías y barberías.

### Propuesta de valor

Para clientes que no saben cómo se verán con un nuevo look y estilistas que necesitan convertir referencias ambiguas en servicios realizables, el producto genera opciones visuales predefinidas y produce una ficha aprobada por el profesional. A diferencia de un editor de fotos generalista, solo propone estilos compatibles con el catálogo del salón y comunica mantenimiento, tiempo, precio y limitaciones.

### Mensaje corto

> Visualiza, valida y define tu próximo look junto con tu estilista.

### Lo que no se debe prometer

- “Resultado exacto”.
- “Diagnóstico profesional automático”.
- “El peinado perfecto para tu rostro”.
- “Color garantizado”.
- “La IA sabe qué te favorece”.

La imagen es una ayuda para la conversación, no una garantía contractual del resultado.

## 12. Diferenciadores propuestos

### 12.1 Catálogo realizable

Cada salón habilita solamente estilos y servicios que puede ofrecer. Un estilo debe contener compatibilidades, mantenimiento y limitaciones.

### 12.2 Consulta sin prompts

El cliente responde preguntas rápidas y selecciona tarjetas visuales. El sistema construye las instrucciones internas.

### 12.3 Aprobación profesional

El estilista puede indicar:

- Realizable.
- Realizable con adaptación.
- No recomendable con el estado actual.

### 12.4 Ficha de servicio

La salida incluye:

- Imagen seleccionada.
- Nombre del estilo.
- Qué cambia.
- Servicios necesarios.
- Tiempo y precio del salón.
- Rutina y frecuencia de mantenimiento.
- Notas del estilista.
- Advertencia de simulación referencial.

### 12.5 Privacidad visible

El cliente conoce cuándo se eliminará su fotografía y puede solicitar eliminación inmediata.

### 12.6 Datos del ciclo completo

Con consentimiento separado, el producto podría aprender qué estilos fueron seleccionados, aprobados y finalmente realizados. Este dato sería más valioso que acumular prompts.

## 13. Alcance del MVP

### Incluido

- PWA responsive.
- Acceso por QR sin cuenta del cliente.
- Consentimiento explícito.
- Una fotografía frontal guiada.
- Validación local de rostro y encuadre.
- Cuestionario de cuatro o cinco respuestas rápidas.
- Catálogo inicial de 12 a 20 estilos.
- Selección de hasta tres estilos.
- Tres simulaciones frontales.
- Estados de generación y reintento.
- Selección de un resultado.
- Validación y notas del estilista.
- Ficha final.
- Enlace de WhatsApp o reserva externa.
- Panel básico del salón.
- Almacenamiento privado y eliminación automática.
- Métricas del piloto.

### No incluido

- Aplicaciones nativas.
- Simulación de video o realidad aumentada.
- Modelo 3D.
- Consistencia entre frente, perfil, espalda y parte superior.
- Diagnóstico de salud capilar.
- Puntuación de belleza.
- Recomendación libre basada solo en forma de rostro.
- Fórmulas exactas de color generadas por IA.
- Recomendaciones patrocinadas.
- Entrenamiento de un modelo propio.
- Red social.
- Marketplace.
- Pagos integrados.
- Agenda, caja, inventario o CRM completo.
- Menores de edad durante el piloto.

## 14. Flujo recomendado

1. El salón entrega un QR o abre el sistema en una tablet.
2. El cliente lee la finalidad y acepta el consentimiento.
3. Toma una fotografía frontal con una guía de posición.
4. El sistema valida que haya un rostro y una imagen utilizable.
5. El cliente indica largo, textura, cambio deseado, mantenimiento y servicios aceptados.
6. El sistema presenta estilos compatibles con el salón.
7. El cliente elige hasta tres.
8. El sistema genera simulaciones.
9. Cliente y estilista seleccionan una.
10. El estilista confirma viabilidad y ajustes.
11. Se genera la ficha final.
12. El cliente puede compartirla o reservar.
13. Las fotografías se eliminan según el plazo comunicado.

## 15. Decisión sobre categorías de género

La idea inicial propone secciones para hombres y mujeres. Para reducir fricción se pueden ofrecer accesos rápidos “Hombre”, “Mujer” y “Unisex”, pero el modelo interno no debe depender exclusivamente de género.

Los filtros principales deben ser:

- Largo.
- Textura.
- Acabado.
- Flequillo.
- Laterales.
- Color.
- Nivel de mantenimiento.
- Cambio discreto, intermedio o radical.

Esto amplía el catálogo sin obligar al cliente a entrar en una categoría rígida.

## 16. Modelo de negocio inicial

### Recomendación

Suscripción B2B por local con un número de consultas incluidas y cargo por uso adicional.

Ejemplo conceptual:

- Prueba piloto: 20 consultas sin costo o a precio simbólico.
- Plan por local: catálogo, usuarios profesionales y consultas incluidas.
- Exceso: precio por consulta generada.
- Futuro: personalización de marca, múltiples locales e integraciones.

No se debe fijar un precio definitivo antes de conocer:

- Costo real de tres generaciones.
- Tasa de reintento.
- Disposición de pago del salón.
- Ahorro de tiempo.
- Incremento de conversión o ticket.

### Por qué no comenzar B2C

- El uso es poco frecuente.
- La adquisición de usuarios puede ser costosa.
- Existen alternativas gratuitas o incluidas en editores masivos.
- El salón aporta distribución, contexto profesional y oportunidad de monetización.

## 17. Estrategia de piloto

### Participantes

- Un salón confirmado.
- Uno o dos estilistas responsables.
- Entre 20 y 50 clientes adultos.
- Catálogo inicial revisado por el salón.

### Preparación

- Documentar el proceso actual de consulta.
- Medir su duración antes del producto.
- Seleccionar servicios que se desean impulsar.
- Definir qué estilos puede ejecutar el equipo.
- Preparar consentimiento y política de retención.
- Acordar cómo se recogerá feedback.

### Operación

- Explicar que el resultado es referencial.
- No obligar al cliente a usar la herramienta.
- Mantener una alternativa manual.
- Registrar fallos sin conservar fotos innecesariamente.
- Revisar semanalmente resultados rechazados.

## 18. Hipótesis y métricas

### Hipótesis principal

Una consulta visual con tres opciones y validación profesional permite que el cliente seleccione un look realizable en menos tiempo que el proceso actual.

### Métrica principal

Porcentaje de consultas que terminan con un look seleccionado y aprobado por el estilista.

### Métricas del embudo

- Consulta iniciada.
- Consentimiento aceptado.
- Fotografía válida al primer intento.
- Cuestionario completado.
- Generaciones completadas.
- Look seleccionado.
- Look aprobado o adaptado.
- Servicio reservado o realizado.

### Objetivos iniciales

- Al menos 85% de fotografías válidas al primer intento.
- Tiempo mediano total inferior a tres minutos.
- Al menos 70% de consultas con un look seleccionado.
- Al menos 80% de estilistas considera útil el resultado.
- Reducción mínima de 25% del tiempo de consulta.
- Menos de 5% de fallos técnicos de generación.
- Menos de 5% de rechazos por alteración evidente de identidad.
- 100% de fotografías eliminadas dentro del plazo comunicado.

Estos valores son criterios de aprendizaje, no pronósticos.

## 19. Benchmark posterior del proveedor de imágenes

El MVP empieza con OpenAI Images detrás de un adaptador. Solo si el vertical slice demuestra valor se recomienda comparar OpenAI y Perfect Corp. utilizando:

- Aproximadamente 50 fotografías consentidas.
- Diversidad de piel, edad adulta, textura, densidad y largo.
- Entre 10 y 12 estilos representativos.
- Evaluación ciega por dos estilistas.

Criterios:

- Conservación de identidad, de 1 a 5.
- Fidelidad al estilo, de 1 a 5.
- Viabilidad profesional.
- Alteraciones del rostro.
- Artefactos en frente, orejas, cuello y fondo.
- Rendimiento por textura.
- Latencia p50 y p95.
- Fallos y reintentos.
- Costo por consulta de tres imágenes.
- Condiciones de privacidad y retención.

Umbrales propuestos:

- Al menos 4/5 en identidad y fidelidad.
- Al menos 80% de imágenes realizables o adaptables.
- Menos de 5% de fallos técnicos.
- Latencia p95 inferior a 90 segundos.
- Costo compatible con el margen del salón.

## 20. Riesgos de producto y mercado

| Riesgo | Consecuencia | Mitigación |
|---|---|---|
| El resultado altera el rostro | Pérdida de confianza | Benchmark, instrucciones estrictas y rechazo visible |
| El look es imposible | Conflicto de expectativas | Compatibilidad y revisión del estilista |
| La generación tarda demasiado | Abandono | Máximo dos trabajos concurrentes, progreso y mensaje de recuperación |
| El salón no adopta la herramienta | Piloto sin uso | Diseñar con estilistas y medir pasos reales |
| El cliente no quiere subir su foto | Menor conversión | Consentimiento claro y eliminación inmediata |
| El costo por imagen es alto | Margen negativo | Calidad escalonada, límites y proveedor intercambiable |
| Competidor integra la misma IA | Poca diferenciación | Catálogo, ficha, datos y flujo profesional |
| Se confunde simulación con garantía | Reclamos | Lenguaje explícito y aprobación profesional |
| Catálogo demasiado grande | Indecisión | Empezar con 12 a 20 estilos |
| Recomendaciones sesgadas | Daño reputacional | Evitar puntuaciones y revisar reglas humanas |
| Baja frecuencia de uso B2C | Mala retención | Distribución y pago B2B |

## 21. Privacidad y confianza

Las fotografías identificables son datos personales. El producto debe aplicar privacidad desde el diseño y revisar el marco peruano de protección de datos antes del piloto comercial.

Controles mínimos:

- Consentimiento explícito y registrable.
- Finalidad específica.
- Proveedor y transferencia informados cuando corresponda.
- Buckets GridFS separados y acceso solo mediante endpoints autorizados.
- Sin URLs públicas o firmadas persistidas.
- Eliminación de EXIF.
- Elección explícita entre descargar/eliminar o conservar para volver.
- Duración máxima de conservación pendiente de revisión humana antes de datos reales.
- Sin fotografías en logs o analítica.
- Sin embeddings faciales.
- Registro de eliminación.
- Procedimiento de incidentes.
- Exclusión de menores en el piloto.

Fuentes regulatorias consultadas:

- [Reglamento de la Ley 29733, Decreto Supremo 016-2024-JUS](https://www.gob.pe/institucion/anpd/normas-legales/6554453-16-2024-jus)
- [Nota oficial sobre el nuevo reglamento](https://www.gob.pe/institucion/minjus/noticias/1067368-ejecutivo-aprueba-nuevo-reglamento-de-la-ley-de-proteccion-de-datos-personales)
- [Principales novedades del reglamento](https://www.gob.pe/institucion/anpd/informes-publicaciones/7406200-principales-novedades-del-nuevo-reglamento-de-proteccion-de-datos-personales)

Este documento no sustituye asesoría legal.

## 22. Criterios para continuar después del piloto

Continuar si:

- El salón utiliza el producto sin acompañamiento constante.
- Los estilistas consideran que mejora la conversación.
- La mayoría de las sesiones produce al menos un resultado útil.
- El costo por consulta permite un margen sostenible.
- Se observa reducción de tiempo, mayor conversión o mayor ticket.
- No existen incidentes de privacidad ni quejas graves de identidad.

Reformular si:

- Los clientes disfrutan la imagen, pero no la usan para decidir.
- El estilista rehace siempre la recomendación.
- La latencia interrumpe la atención.
- La misma experiencia se obtiene fácilmente con una aplicación gratuita.

Detener o pivotar si:

- La peluquería no encuentra valor económico u operativo.
- La calidad visual no alcanza los umbrales después de cambiar proveedor.
- Los costos o requisitos de privacidad hacen inviable el modelo.

## 23. Backlog posterior al MVP

Solo después de validar el piloto:

- Segunda fotografía lateral del look seleccionado.
- Comparación entre proveedores por tipo de cabello.
- Colores y técnicas de color más precisas.
- Referencias personalizadas del cliente.
- Catálogo compartido entre sedes.
- Integración con reservas existentes.
- Mensajes de seguimiento.
- Historial del cliente con consentimiento.
- Comparación del look simulado con el resultado real.
- Recomendaciones de productos del salón.
- Marca blanca.
- Integraciones con sistemas de gestión.
- Aplicación nativa si la evidencia lo justifica.

## 24. Decisiones pendientes

- Duración máxima de conservación cuando el cliente elige volver.
- Catálogo inicial y responsable de aprobarlo.
- Servicios que se medirán.
- Precio del piloto y futuro plan B2B.
- Canal de reserva futuro; no forma parte del MVP local.
- Responsable del tratamiento de datos en la relación producto-salón.
- Revisión legal del texto de consentimiento, roles y transferencias del proveedor.

## 25. Conclusión

El mercado confirma la demanda por visualizar cortes y colores, pero también demuestra que la generación de imágenes ya no es una ventaja suficiente. El producto debe especializarse en la consulta profesional y medir su impacto en un salón real.

La mejor versión del MVP no es la que genera más estilos. Es la que permite que cliente y estilista acuerden rápidamente un look realista, documentado, realizable y tratado con privacidad.
