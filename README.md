# PrismaFlow

**PrismaFlow** es una plataforma SaaS "todo en uno" diseñada para optimizar y centralizar el flujo de trabajo (workflow) en equipos de desarrollo. Reúne herramientas críticas como creadores de diagramas ERD, flujos de trabajo, chats de equipo y tableros Kanban en un solo espacio unificado, minimalista y rápido.

Este proyecto nació con un fuerte enfoque en la aplicación de **buenas prácticas, patrones de diseño modernos y arquitectura de software escalable**, marcando el inicio de una línea de herramientas profesionales con planes de lanzamiento y expansión a futuro.

---

## 🚀 Características Principales

*   **ERD Tool (Diagramas Entidad-Relación):** Diseña y visualiza bases de datos de forma interactiva y en tiempo real.
*   **Diagramas de Flujo:** Planifica la lógica de tus aplicaciones y la arquitectura del sistema visualmente.
*   **Kanban Boards:** Gestiona tareas, asigna responsables y arrastra tarjetas para controlar el progreso del sprint.
*   **Chat en Tiempo Real:** Comunicación instantánea entre los miembros del equipo integrada directamente en el espacio de trabajo.
*   **Gestión de Equipos y Roles:** Control de acceso basado en la organización y proyectos compartidos.

---

## 🛠️ Stack Tecnológico

El proyecto está construido sobre un ecosistema de desarrollo de última generación para garantizar rendimiento, seguridad y una experiencia de usuario fluida:

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components y Middleware optimizado).
*   **Gestor de Paquetes:** [pnpm](https://pnpm.io/) (Instalaciones ultrarrápidas y gestión eficiente de monorrepos/dependencias).
*   **Estilos y UI:** [Tailwind CSS](https://tailwindcss.com/) (Diseño responsivo, fluido y soporte nativo para modo oscuro).
*   **Backend & Base de Datos:** [Supabase](https://supabase.com/) (Autenticación, PostgreSQL, tiempo real mediante WebSockets y Triggers SQL automáticos para perfiles).
*   **Pasarela de Pagos:** [Stripe](https://stripe.com/) (Suscripciones recurrentes e integración mediante Webhooks seguros).

---

## 📦 Guía de Instalación y Desarrollo Local

Sigue estos pasos para clonar el proyecto y ejecutarlo en tu entorno local.

### 1. Prerrequisitos
Asegúrate de tener instalado **Node.js** (versión v18 o superior) y **pnpm**. Si no tienes pnpm, puedes instalarlo globalmente con:
```bash
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

### 2. Clonar el repositorio

```bash
git clone [https://github.com/tu-usuario/prismaflow.git](https://github.com/tu-usuario/prismaflow.git)
cd prismaflow
```

### 3. Instalar dependencias

Utiliza pnpm para instalar los paquetes de manera eficiente:

```bash
pnpm install
```

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto y añade las credenciales necesarias de Supabase y Stripe. Puedes guiarte con la siguiente estructura:

```env
# Next.js Config
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Auth & Database)
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Stripe (Pagos y Webhooks)
STRIPE_SECRET_KEY=tu_stripe_secret_key
STRIPE_WEBHOOK_SECRET=tu_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
```

### 5. Levantar el servidor de desarrollo

Una vez configurado todo, inicia el entorno local con:

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en acción.

---

## 💳 Sistema de Planes y Pagos (SaaS)

PrismaFlow implementa un modelo de monetización flexible basado en suscripciones SaaS, completamente automatizado con **Stripe Webhooks** para escuchar eventos de creación, actualización o cancelación de suscripciones en tiempo real.

Actualmente disponemos de dos niveles de acceso estructurados para diferentes necesidades:

| Plan | Precio (USD) | Características Incluidas |
| --- | --- | --- |
| **Plan Pro** | `$4.00 / mes` | Diseñado para freelancers y desarrolladores independientes. Da acceso a la mayoría de las herramientas de diagramación y tableros con límites amplios, ideal para apoyar el crecimiento del proyecto. |
| **Plan Enterprise** | `$10.00 / mes` | Diseñado para equipos y organizaciones. Desbloquea el 100% de las funciones de la plataforma de forma ilimitada: colaboración masiva, historial de cambios avanzado y soporte prioritario. |

---

## 🛠️ Comandos Útiles

Durante el desarrollo, puedes hacer uso de los siguientes scripts definidos en el proyecto:

* `pnpm dev`: Arranca el servidor de desarrollo local.
* `pnpm build`: Compila la aplicación para producción optimizando Server Components y rutas estáticas.
* `pnpm start`: Inicia la aplicación compilada en modo producción.