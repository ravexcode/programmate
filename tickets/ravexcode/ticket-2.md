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

* [ ] CRUD completo (`GET`, `POST`, `PUT`, `DELETE`)
* [ ] Validación de pertenencia a equipo
* [ ] Manejo de errores consistente
* [ ] Tipado fuerte en TypeScript

**Notas técnicas:**

* Usar middlewares para auth
* Evitar lógica duplicada