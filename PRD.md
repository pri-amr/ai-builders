# PRD-001: Aplicación Web de Finanzas Personales — Centraliza el control de ingresos y egresos en múltiples bancos y efectivo (ARS/USD), con acceso seguro mediante passkeys o contraseña

Versión: 1.7
Fecha: 15-07-2026

---

## Contexto y Problema

Los usuarios argentinos administran dinero distribuido en múltiples bancos locales y en efectivo, en un entorno bimonetario (ARS/USD) con tipos de cambio volátiles y múltiples cotizaciones paralelas. Las herramientas genéricas de finanzas personales no contemplan esta complejidad. Esta aplicación centraliza el control de ingresos y egresos en un único lugar, con acceso seguro mediante passkeys o contraseña, a elección del usuario.

---

## Objetivos

| # | Objetivo |
| --- | --- |
| O1 | Permitir el registro y seguimiento de ingresos y egresos por banco, moneda y período |
| O2 | Ofrecer visibilidad del saldo disponible en cada banco y en efectivo |
| O3 | Proveer conversión de USD a ARS y viceversa en tiempo real con múltiples tipos de cambio |
| O4 | Garantizar acceso seguro permitiendo al usuario elegir entre passkeys (WebAuthn) o usuario y contraseña |
| O5 | Facilitar el análisis visual del comportamiento financiero mediante gráficos filtrables |

---

## Requerimientos Funcionales (RF)

### Autenticación

| ID | Requerimiento |
| --- | --- |
| RF-01 | El sistema debe permitir al usuario, al momento de registrarse, elegir uno de los siguientes métodos de autenticación: passkey (WebAuthn/FIDO2) o usuario y contraseña |
| RF-02 | El sistema debe permitir al usuario autenticarse únicamente con el método que eligió al registrarse (passkey o usuario y contraseña, no ambos) |
| RF-03 | El sistema debe redirigir al dashboard una vez completada la autenticación exitosa |
| RF-04 | El sistema debe mostrar un mensaje de error descriptivo si el intento de autenticación falla o el usuario lo cancela, independientemente del método elegido |

### Gestión de transacciones

| ID | Requerimiento |
| --- | --- |
| RF-05 | El sistema debe permitir registrar una transacción de tipo egreso |
| RF-06 | El sistema debe permitir registrar una transacción de tipo ingreso |
| RF-07 | El sistema debe proveer de un AM para las fuentes de dinero y permitir seleccionar entre estas desde un principio: Santander, BNA, Macro, Lemon, Brubank o Efectivo |
| RF-08 | El sistema debe requerir que cada transacción esté asociada a una moneda: ARS o USD |
| RF-09 | El sistema debe requerir que cada transacción esté asociada a una categoría (ej.: comida, transporte, sueldo, freelance) |
| RF-10 | El sistema debe requerir que cada transacción esté asociada a una fecha en formato DD-MM-YYYY |
| RF-11 | El sistema debe permitir editar una transacción existente |
| RF-12 | El sistema debe permitir eliminar una transacción existente con confirmación explícita del usuario |
| RF-13 | El sistema debe validar que el monto de una transacción sea un número mayor a cero antes de permitir guardarla |
| RF-14 | El sistema debe validar que todos los campos obligatorios (monto, fuente, moneda, categoría, fecha, descripción) estén completos antes de permitir guardar una transacción |
| RF-15 | El sistema debe mostrar un mensaje de error si el guardado de una transacción falla, sin perder los datos ingresados por el usuario |
| RF-36 | El sistema debe requerir que cada transacción tenga una descripción de texto libre ingresada por el usuario |

### Saldos

| ID | Requerimiento |
| --- | --- |
| RF-16 | El sistema debe mostrar el saldo disponible de forma separada por cada fuente de dinero (banco o efectivo) |
| RF-17 | El sistema debe mostrar el saldo total consolidado en ARS y en USD de forma independiente |

### Vistas por período y paginación

| ID | Requerimiento |
| --- | --- |
| RF-18 | El sistema debe permitir filtrar el listado de transacciones por día |
| RF-19 | El sistema debe permitir filtrar el listado de transacciones por mes |
| RF-20 | El sistema debe permitir filtrar el listado de transacciones por año |
| RF-21 | El sistema debe paginar el listado de transacciones mostrando un máximo de 50 registros por página |
| RF-22 | El sistema debe permitir navegar entre páginas del listado de transacciones |

### Gráficos

| ID | Requerimiento |
| --- | --- |
| RF-23 | El sistema debe mostrar un gráfico de gastos filtrable por rango de fechas |
| RF-24 | El sistema debe mostrar un gráfico de gastos filtrable por tipo o categoría de gasto |

### Conversor de divisas

| ID | Requerimiento |
| --- | --- |
| RF-25 | El sistema debe incluir una sección dedicada para convertir entre USD y ARS en ambas direcciones |
| RF-26 | El sistema debe permitir al usuario ingresar un monto en USD o ARS |
| RF-27 | El sistema debe permitir al usuario seleccionar el tipo de cambio a aplicar entre: oficial, blue, bolsa, cripto, tarjeta, contadoconliqui, mayorista |
| RF-28 | El sistema debe consultar la cotización actual a la API https://dolarapi.com/v1/dolares/{tipo} al momento de la conversión |
| RF-29 | El sistema debe mostrar el resultado de la conversión en la moneda destino correspondiente a la dirección seleccionada |
| RF-30 | El sistema debe mostrar un mensaje de error explícito si la API no está disponible, sin mostrar ningún valor de conversión |
| RF-34 | El sistema debe permitir al usuario seleccionar la dirección de la conversión: USD → ARS o ARS → USD |

### Autenticación (passkeys)

| ID | Requerimiento |
| --- | --- |
| RF-31 | El sistema debe permitir al usuario registrar más de una passkey en su cuenta |
| RF-32 | El sistema debe mostrar el listado de passkeys registradas con el nombre o identificador de dispositivo de cada una |
| RF-33 | El sistema debe permitir al usuario eliminar una passkey registrada, siempre que quede al menos una activa en la cuenta |

### Gráficos (vista por defecto)

| ID | Requerimiento |
| --- | --- |
| RF-35 | El sistema debe mostrar como vista por defecto de la sección de gráficos un gráfico de torta con la distribución porcentual de gastos por categoría del mes en curso |

---

## Requerimientos No Funcionales (RNF)

| ID | Categoría | Requerimiento |
| --- | --- | --- |
| RNF-01 | Seguridad | El sistema debe implementar el estándar WebAuthn/FIDO2 para los usuarios que elijan autenticarse con passkey, y hasheo de contraseñas mediante bcrypt con factor de costo ≥ 12 (o argon2id con parámetros equivalentes o superiores a los recomendados por OWASP) para los que elijan usuario y contraseña |
| RNF-02 | Seguridad | Los datos financieros del usuario deben almacenarse cifrados en reposo utilizando AES-256 (o algoritmo equivalente) |
| RNF-03 | Rendimiento | Las páginas deben cargarse en menos de 2 segundos bajo condiciones de red normales (conexión ≥ 10 Mbps) |
| RNF-04 | Rendimiento | La consulta a la API de dolarapi.com debe completarse y reflejarse en pantalla en un máximo de 5 segundos |
| RNF-05 | Disponibilidad | La aplicación debe estar disponible el 99 % del tiempo medido mensualmente |
| RNF-06 | Usabilidad | La interfaz debe ser completamente funcional en resoluciones desde 320 px de ancho (mobile-first), sin scroll horizontal |
| RNF-07 | Usabilidad | Un usuario debe poder registrar una transacción en menos de 30 segundos desde el dashboard |
| RNF-08 | Resiliencia | Si la API de dolarapi.com no responde en más de 5 segundos, el sistema debe mostrar un mensaje de error; la aplicación permanece navegable y funcional |
| RNF-09 | Compatibilidad | La aplicación debe funcionar en las últimas dos versiones de Chrome, Firefox, Safari y Edge |
| RNF-10 | Privacidad | El backend debe verificar en cada petición que el usuario autenticado sea el propietario de los datos solicitados; ningún dato (transacciones, saldos, fuentes de dinero, passkeys) de un usuario debe ser accesible ni modificable por otro usuario |

---

## Criterios de Aceptación (AC)

**AC-01 · Autenticación exitosa con el método elegido (cubre RF-01–RF-03)**

Dado que un usuario ya se registró eligiendo passkey o usuario y contraseña como método de autenticación
Cuando accede a la URL de la aplicación y completa el flujo de autenticación con ese método
Entonces el sistema lo redirige al dashboard

---

**AC-02 · Error en autenticación (cubre RF-02/RF-04)**

Dado que un usuario intenta autenticarse con el método que eligió al registrarse (passkey o usuario y contraseña)
Cuando cancela el diálogo, el dispositivo rechaza la verificación, o ingresa credenciales incorrectas
Entonces el sistema muestra en pantalla un mensaje de error indicando que la autenticación no fue exitosa, habilita un control para reintentar el flujo de autenticación, y no redirige al dashboard

---

**AC-03 · Registro de egreso (cubre RF-05)**

Dado que el usuario está autenticado en el dashboard
Cuando completa el formulario de egreso con monto, banco (ej.: Lemon), moneda (ARS), categoría, fecha y descripción, y confirma
Entonces la transacción aparece en el listado y el saldo de Lemon en ARS se reduce exactamente en el monto ingresado

---

**AC-04 · Registro de ingreso (cubre RF-06)**

Dado que el usuario está autenticado en el dashboard
Cuando completa el formulario de ingreso con monto, banco (ej.: Santander), moneda (ARS), categoría, fecha y descripción, y confirma
Entonces la transacción aparece en el listado y el saldo de Santander en ARS se incrementa exactamente en el monto ingresado

---

**AC-05 · Validación de formulario — campo obligatorio vacío (cubre RF-14)**

Dado que el usuario está completando el formulario de transacción
Cuando intenta guardar sin completar alguno de los campos obligatorios (monto, fuente, moneda, categoría, fecha o descripción)
Entonces el sistema no guarda la transacción y muestra un mensaje de error indicando cuál campo está incompleto

---

**AC-06 · Validación de formulario — monto inválido (cubre RF-13)**

Dado que el usuario está completando el formulario de transacción
Cuando ingresa un monto igual a cero o negativo e intenta guardar
Entonces el sistema no guarda la transacción y muestra un mensaje de error indicando que el monto debe ser mayor a cero

---

**AC-07 · Error de persistencia (cubre RF-15)**

Dado que el usuario completó correctamente el formulario de transacción
Cuando el sistema falla al intentar guardar la transacción (ej.: error de red o base de datos)
Entonces el sistema muestra un mensaje de error y mantiene los datos del formulario intactos para que el usuario pueda reintentar

---

**AC-08 · Edición de transacción (cubre RF-11)**

Dado que el usuario selecciona "editar" en una transacción existente
Cuando modifica el monto y confirma los cambios
Entonces el listado refleja el nuevo monto y el saldo del banco correspondiente se recalcula en consecuencia

---

**AC-09 · Eliminación de transacción (cubre RF-12)**

Dado que el usuario selecciona "eliminar" en una transacción existente
Cuando confirma la acción en el diálogo de confirmación
Entonces la transacción desaparece del listado y el saldo del banco correspondiente se recalcula como si esa transacción nunca hubiera existido

---

**AC-10 · Saldo consolidado ARS y USD (cubre RF-17)**

Dado que el usuario tiene transacciones en ARS en Santander y en USD en Brubank
Cuando accede a la vista de saldos
Entonces el sistema muestra el saldo total en ARS (solo sumando transacciones en ARS de todos los bancos) y el saldo total en USD (solo sumando transacciones en USD de todos los bancos), de forma separada

---

**AC-11 · Filtro por día (cubre RF-18)**

Dado que el usuario está en el listado de transacciones con registros en distintas fechas
Cuando selecciona el filtro por día y elige "2026-06-15"
Entonces el listado muestra únicamente las transacciones cuya fecha es exactamente 2026-06-15

---

**AC-12 · Filtro por mes (cubre RF-19)**

Dado que el usuario está en el listado de transacciones con registros en distintos meses
Cuando selecciona el filtro por mes y elige "mayo 2026"
Entonces el listado muestra únicamente las transacciones cuya fecha corresponde a mayo 2026

---

**AC-13 · Filtro por año (cubre RF-20)**

Dado que el usuario está en el listado de transacciones con registros en distintos años
Cuando selecciona el filtro por año y elige "2025"
Entonces el listado muestra únicamente las transacciones cuya fecha corresponde al año 2025

---

**AC-14 · Paginación del listado (cubre RF-21–RF-22)**

Dado que el usuario tiene más de 50 transacciones registradas
Cuando accede al listado sin ningún filtro activo
Entonces el sistema muestra únicamente las primeras 50 transacciones y habilita los controles de paginación para navegar al resto

---

**AC-15 · Saldo por fuente de dinero (cubre RF-16)**

Dado que el usuario tiene ingresos y egresos registrados asociados a "Brubank" en ARS
Cuando accede a la vista de saldos
Entonces el saldo de Brubank en ARS es igual a la suma de todos sus ingresos en ARS en esa cuenta menos la suma de todos sus egresos en ARS en esa cuenta

---

**AC-16 · Vista por defecto del gráfico (actualizado — cubre RF-35)**

Dado que el usuario navega a la sección de gráficos sin filtros aplicados
Cuando la sección termina de cargar
Entonces el sistema muestra un gráfico de torta con la distribución porcentual de gastos por categoría correspondiente al mes en curso

---

**AC-17 · Conversor USD → ARS con API disponible (actualizado — cubre RF-28–RF-30, RF-34)**

Dado que el usuario está en la sección de conversión, seleccionó la dirección USD → ARS, y la API de dolarapi.com responde
Cuando ingresa 100 USD y selecciona el tipo de cambio "blue"
Entonces el sistema muestra el equivalente en ARS calculado con el valor retornado por la API para el tipo "blue" en el atributo "venta" (es decir, response.venta)

---

**AC-18 · Error de conversión por API no disponible (cubre RF-30)**

Dado que el usuario está en la sección de conversión y seleccionó cualquier dirección de conversión (USD → ARS o ARS → USD)
Cuando el sistema intenta consultar la API de dolarapi.com y esta no responde, devuelve error o supera el tiempo máximo de espera configurado
Entonces el sistema muestra un mensaje de error explícito indicando que no fue posible obtener la cotización actual y no muestra ningún valor de conversión

---

**AC-19 · Conversor ARS → USD con API disponible (cubre RF-34)**

Dado que el usuario está en la sección de conversión, seleccionó la dirección ARS → USD, y la API de dolarapi.com responde
Cuando ingresa 1.000 ARS y selecciona el tipo de cambio "oficial"
Entonces el sistema muestra el equivalente en USD calculado dividiendo 1.000 por el valor de cotización retornado por la API para el tipo "oficial" en el atributo "venta" (es decir, response.venta)

---

**AC-20 · Registro de passkey adicional (cubre RF-31–RF-32)**

Dado que el usuario está autenticado y accede a la sección de gestión de passkeys
Cuando completa el flujo de registro de una nueva passkey en un dispositivo diferente
Entonces la nueva passkey aparece en el listado y permite autenticar al usuario en sesiones futuras

---

**AC-21 · Bloqueo de eliminación de última passkey (cubre RF-33)**

Dado que el usuario tiene exactamente una passkey registrada
Cuando intenta eliminarla
Entonces el sistema bloquea la operación y muestra un mensaje indicando que debe quedar al menos una passkey activa

---

**AC-22 · Filtro de gráfico por rango de fechas (cubre RF-23)**

Dado que el usuario se encuentra en la sección de gráficos y existen transacciones registradas en distintos períodos
Cuando selecciona un rango de fechas determinado
Entonces el gráfico muestra únicamente los gastos correspondientes a las transacciones incluidas dentro del rango seleccionado

---

**AC-23 · Filtro de gráfico por categoría de gasto (cubre RF-24)**

Dado que el usuario se encuentra en la sección de gráficos y existen gastos registrados en múltiples categorías
Cuando selecciona una categoría específica de gasto
Entonces el gráfico muestra únicamente la información correspondiente a la categoría seleccionada

---

**AC-24 · Selección de tipo de cambio (cubre RF-27)**

Dado que el usuario se encuentra en la sección de conversión
Cuando selecciona uno de los tipos de cambio disponibles (oficial, blue, bolsa, cripto, tarjeta, contadoconliqui o mayorista)
Entonces el sistema utiliza la cotización correspondiente al tipo seleccionado para realizar la conversión y mostrar el resultado

---

**AC-25 · Registro de transacción con datos obligatorios completos (cubre RF-07–RF-10, RF-36)**

Dado que el usuario está registrando una nueva transacción
Cuando selecciona una fuente de dinero válida, una moneda válida, una categoría y una fecha, e ingresa un monto válido y una descripción, y confirma
Entonces el sistema guarda la transacción, y los valores de fuente, moneda, categoría, fecha, descripción y monto almacenados coinciden exactamente con los ingresados por el usuario

---

**AC-26 · Validación de fuente de dinero obligatoria (cubre RF-07)**

Dado que el usuario está completando el formulario de transacción
Cuando intenta guardar la transacción sin seleccionar una fuente de dinero
Entonces el sistema impide el guardado y muestra un mensaje indicando que la fuente de dinero es obligatoria

---

**AC-27 · Validación de moneda obligatoria (cubre RF-08)**

Dado que el usuario está completando el formulario de transacción
Cuando intenta guardar la transacción sin seleccionar una moneda
Entonces el sistema impide el guardado y muestra un mensaje indicando que la moneda es obligatoria

---

**AC-28 · Validación de categoría obligatoria (cubre RF-09)**

Dado que el usuario está completando el formulario de transacción
Cuando intenta guardar la transacción sin seleccionar una categoría
Entonces el sistema impide el guardado y muestra un mensaje indicando que la categoría es obligatoria

---

**AC-29 · Validación de fecha obligatoria (cubre RF-10)**

Dado que el usuario está completando el formulario de transacción
Cuando intenta guardar la transacción sin seleccionar una fecha
Entonces el sistema impide el guardado y muestra un mensaje indicando que la fecha es obligatoria

---

**AC-30 · Visualización de la sección de conversión (cubre RF-25)**

Dado que el usuario accede a la sección de conversión y la API de dolarapi.com está disponible
Cuando la página termina de cargar
Entonces el sistema muestra: un campo para ingresar el monto, un control para seleccionar la dirección de conversión (USD → ARS o ARS → USD), y un campo donde se mostrará el resultado de la conversión

---

**AC-31 · Cálculo de conversión con datos válidos (cubre RF-26, RF-29)**

Dado que el usuario se encuentra en la sección de conversión, seleccionó una dirección de conversión (USD → ARS o ARS → USD) y un tipo de cambio, y la API de dolarapi.com responde
Cuando ingresa un monto válido mayor a cero en el campo de origen
Entonces el sistema muestra en el campo de resultado el monto convertido a la moneda destino, calculado con la cotización obtenida de la API para el tipo de cambio seleccionado

---

**AC-32 · Aislamiento de datos entre usuarios (cubre RNF-10)**

Dado que el usuario A está autenticado y tiene transacciones, saldos, fuentes de dinero y passkeys propias registradas, y existe un usuario B con transacciones, saldos, fuentes de dinero y passkeys propias y distintas
Cuando el usuario A solicita el listado de transacciones, el detalle de saldos, el listado de fuentes de dinero, el listado de passkeys, o intenta acceder directamente a un recurso de usuario B mediante su ID (una transacción, una fuente de dinero o una passkey)
Entonces el sistema únicamente devuelve datos pertenecientes a usuario A, y deniega o no devuelve ningún dato de usuario B (ninguna de sus transacciones, saldos, fuentes de dinero ni passkeys), respondiendo en cada caso con 403/404 o un resultado vacío según corresponda

---

**AC-33 · Alta de fuente de dinero (cubre RF-07)**

Dado que el usuario está autenticado y accede a la gestión de fuentes de dinero
Cuando ingresa un nombre para una nueva fuente y confirma el alta
Entonces la nueva fuente queda registrada y disponible para seleccionar al registrar una transacción

---

**AC-34 · Modificación de fuente de dinero (cubre RF-07)**

Dado que el usuario está autenticado y existe una fuente de dinero previamente creada por él
Cuando edita su nombre y confirma los cambios
Entonces el listado de fuentes de dinero muestra el nombre actualizado, y las transacciones ya registradas con esa fuente mantienen su asociación

---

**AC-35 · Validación de descripción obligatoria (cubre RF-36)**

Dado que el usuario está completando el formulario de transacción
Cuando intenta guardar la transacción sin completar la descripción
Entonces el sistema impide el guardado y muestra un mensaje indicando que la descripción es obligatoria

---

## Fuera de Alcance

- Integración directa con APIs bancarias (open banking / scraping bancario)
- Sincronización automática de movimientos de cuentas bancarias
- Notificaciones push, por email o SMS
- Soporte para múltiples usuarios en una misma cuenta (cuenta compartida / familia)
- Exportación de datos a CSV o PDF
- Aplicación móvil nativa (iOS / Android)
- Gestión de inversiones, plazos fijos o criptoactivos
- Recuperación de cuenta (el usuario puede registrar múltiples passkeys en distintos dispositivos como respaldo; el flujo de recuperación sin passkey se abordará en v2)

---

## Riesgos y Dependencias

### Riesgos

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- | --- |
| R01 | La API de dolarapi.com puede no tener SLA ni disponibilidad garantizada | Media | Alto | Mostrar error sin romper la app (RNF-08) |
| R02 | Soporte de passkeys limitado en dispositivos/navegadores del usuario | Media | Alto | El usuario puede optar por registrarse y autenticarse con usuario y contraseña si su dispositivo no soporta WebAuthn |
| R03 | Pérdida o robo del dispositivo con passkey bloquea el acceso | Baja | Medio | El usuario puede registrar passkeys en múltiples dispositivos; flujo de recuperación sin passkey se abordará en v2 |
| R04 | Cambios en la estructura de respuesta de dolarapi.com | Baja | Medio | Versionar la integración y agregar validación del esquema de respuesta |

### Dependencias

| ID | Dependencia | Tipo | Descripción |
| --- | --- | --- | --- |
| D01 | dolarapi.com | Externa | API pública para obtención de tipos de cambio USD/ARS.<br>Endpoint: GET https://dolarapi.com/v1/dolares/{tipo} |
| D02 | WebAuthn / FIDO2 | Estándar web | Protocolo de autenticación sin contraseña. Requiere soporte en navegador y dispositivo del usuario |
| D03 | Base de datos | Infraestructura | Almacenamiento persistente de transacciones, categorías y credenciales passkey |
| D04 | Servidor backend | Infraestructura | Necesario para gestión de sesiones WebAuthn y operaciones seguras sobre la base de datos |
