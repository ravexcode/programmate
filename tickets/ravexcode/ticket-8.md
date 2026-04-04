## 🎟️ TICKET: Usar SupabaseAuth en ves de los metodos antiguos

**ID:** BE-005
**Tipo:** Refactor
**Prioridad:** Media

**Descripción:**
Mejorar el gestión de cuentas de usuarios con SupabaseAuth, el cual ahorra líneas de código y optimiza tanto el desarollo como el inicio de sesión, registro y hasta cierre de sesión.

**Alcance:**

* Mejorar el desarollo de la gestión de cuentas
* Mejorar el rendimiento del auth
* Aprovechar las features de Supabase

**Criterios de aceptación:**

* [ ] El usuario puede registrarse
* [ ] El usuario puede iniciar sesión
* [ ] El usuario puede cerrar sesión
* [ ] Se envía un correo al momento de iniciar sesión
* [ ] Se guardan los datos en IORedis

**Notas técnicas:**

* Revisar control de cuentas
* Revisar emails
* Revisar velocidad y ahorro de código