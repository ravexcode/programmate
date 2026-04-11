## 🎟️ TICKET: Teams API Completion

**ID:** BE-002
**Tipo:** Feature
**Prioridad:** Media

**Descripción:**
Finalizar el módulo de equipos (teams), incluyendo CRUD completo y relaciones con usuarios.

**Alcance:**

* Crear endpoints faltantes
* Validar permisos por usuario
* Integrar con Supabase

**Criterios de aceptación:**

* [x] CRUD completo (`GET`, `POST`, `PUT`, `DELETE`)
* [x] Validación de pertenencia a equipo
* [x] Manejo de errores consistente

**Notas técnicas:**

* Usar middlewares para auth
* Evitar lógica duplicada