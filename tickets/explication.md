# 📌 Sistema de Tickets – Guía de Uso

Este documento explica cómo funcionan los tickets dentro del proyecto **Programmate**, cómo deben interpretarse y cómo utilizarlos correctamente durante el desarrollo.

---

## 🧩 ¿Qué es un ticket?

Un **ticket** es una unidad de trabajo que representa una tarea específica dentro del proyecto. Sirve para:

* Organizar el desarrollo
* Dividir el trabajo en partes manejables
* Dar seguimiento al progreso
* Mantener claridad entre backend, frontend y objetivos generales

---

## 🏷️ Estructura de un Ticket

Cada ticket sigue una estructura estándar:

### 1. ID

Identificador único del ticket.

**Formato:**

* `BE-XXX` → Backend
* `FE-XXX` → Frontend
* `PR-XXX` → Proyecto general

**Ejemplo:**

```
BE-001
FE-002
```

---

### 2. Tipo

Define la naturaleza del trabajo.

**Tipos comunes:**

* `Feature` → Nueva funcionalidad
* `Task` → Tarea técnica específica
* `Improvement` → Mejora de algo existente
* `Refactor` → Limpieza o reestructuración de código

---

### 3. Prioridad

Indica qué tan urgente o importante es el ticket.

**Niveles:**

* Alta → Crítico para el avance
* Media → Importante pero no bloqueante
* Baja → Mejora opcional o estética

---

### 4. Descripción

Explica qué se debe hacer de forma clara y directa.

Debe responder:

* ¿Qué problema se resuelve?
* ¿Qué se espera construir o mejorar?

---

### 5. Alcance

Define los límites del ticket.

Incluye:

* Qué SÍ se debe hacer
* Qué NO está incluido (implícitamente)

Esto evita scope creep.

---

### 6. Criterios de aceptación

Checklist que define cuándo el ticket está terminado correctamente.

**Ejemplo:**

```
- [ ] Endpoint responde correctamente
- [ ] No hay errores en consola
- [ ] Datos guardados en base de datos
```

Un ticket **no está completo** hasta cumplir todos los criterios.

---

### 7. Notas técnicas

Información adicional relevante para desarrollo.

Incluye:

* Librerías a usar
* Funciones críticas
* Buenas prácticas específicas
* Riesgos conocidos

---

## 🔄 Flujo de trabajo

### 1. Selección

Elegir un ticket basado en prioridad.

---

### 2. Desarrollo

Crear una rama basada en el ticket:

```
feature/BE-001-payment-testing
fix/FE-002-blog-bug
```

---

### 3. Implementación

Desarrollar únicamente lo definido en el ticket.

Evitar:

* Agregar features no solicitadas
* Mezclar múltiples tickets en uno

---

### 4. Validación

Revisar criterios de aceptación:

* ¿Todo el checklist está completo?
* ¿Funciona correctamente?
* ¿No rompe otras partes del sistema?

---

### 5. Cierre

El ticket se marca como terminado cuando:

* Cumple todos los criterios
* El código está integrado (merge)
* No hay errores conocidos

---

## ⚠️ Buenas prácticas

* Un ticket = una responsabilidad clara
* No hacer tickets demasiado grandes
* Mantener descripciones concretas
* Actualizar estado constantemente
* Documentar decisiones importantes

---

## 🚫 Errores comunes

* Tickets ambiguos (“arreglar cosas”)
* Falta de criterios de aceptación
* Mezclar backend y frontend en un solo ticket
* No respetar prioridades
* No validar antes de cerrar

---

## 🧠 En resumen

Los tickets son la base del orden en el proyecto.
Si están bien definidos:

* El desarrollo es más rápido
* Hay menos errores
* Es más fácil escalar el sistema

Si están mal definidos:

* Hay confusión
* Se pierde tiempo
* Aumentan los bugs

---

## ✅ Recomendación final

Antes de empezar cualquier ticket, asegúrate de entender:

* Qué se espera exactamente
* Cómo se va a validar
* Qué impacto tiene en el sistema

Si algo no está claro, el ticket está mal definido y debe ajustarse antes de comenzar.