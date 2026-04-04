## 🎟️ TICKET: Payment API Testing & Hardening

**ID:** BE-001
**Tipo:** Task
**Prioridad:** Alta

**Descripción:**
Validar y robustecer el flujo completo de pagos usando Stripe, asegurando integridad, seguridad y consistencia con Supabase.

**Alcance:**

* Validar endpoints existentes de pago
* Verificar firma de webhooks de Stripe
* Confirmar persistencia correcta en Supabase
* Manejo de errores y edge cases (pagos duplicados, fallidos, cancelados)

**Criterios de aceptación:**

* [x] Webhook validado correctamente con firma
* [x] No hay duplicación de registros en DB
* [x] Manejo correcto de estados (`pending`, `completed`, `failed`)
* [x] Logs claros para debugging
* [x] Tests básicos manuales o automatizados

**Notas técnicas:**

* Revisar uso de `stripe.webhooks.constructEvent`
* Validar uso de variables de entorno seguras
* Evitar exponer secretos en cliente