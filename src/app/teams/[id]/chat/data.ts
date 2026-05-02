// Usuario principal (solo lectura)
const user = {
  email: "rafa@email.com",
  username: "Rafael Martinez",
  id: "da23-j943-j89c-dj8x-hws2"
};

// Usuarios
export const integrants = [
  {
    email: "dev@email.com",
    username: "Carlos Dev",
    id: "usr-1"
  },
  {
    email: "design@email.com",
    username: "Ana Torres",
    id: "usr-2"
  },
  {
    email: "qa@email.com",
    username: "Luis QA",
    id: "usr-3"
  },
  {
    email: "pm@email.com",
    username: "Sofia PM",
    id: "usr-4"
  }
];

export const imported_messages = [
  {
    email: "dev@email.com",
    username: "Carlos Dev",
    id: "m1",
    content: "Ya subí los últimos cambios al repo",
    sent_at: new Date(Date.now() - 1000 * 60 * 50),
    isEdited: false,
  },
  {
    email: "rafa@email.com",
    username: "Rafael Martinez",
    id: "m2",
    content: "¿Incluye lo del login?",
    sent_at: new Date(Date.now() - 1000 * 60 * 49),
    isEdited: false,
  },

  ...Array.from({ length: 48 }, (_, i) => {
    const users = [
      user,
      ...integrants
    ];

    const texts = [
      "Eso ya quedó listo",
      "Hay que revisar ese bug",
      "No está funcionando en producción",
      "En local sí sirve",
      "Voy a hacer commit",
      "Revisa el endpoint",
      "Creo que es problema del estado",
      "Haz un refresh",
      "Ya quedó 👍",
      "Falta optimizar eso",
      "Está raro ese comportamiento",
      "¿Quién está en backend?",
      "Voy a ver los logs",
      "Ese error ya lo vi antes",
      "Se puede mejorar luego",
      "Está listo para pruebas",
      "Subiendo cambios...",
      "Listo 🚀",
      "¿Puedes validar eso?",
      "Creo que rompí algo 😅"
    ];

    const u = users[i % users.length];

    return {
      email: u.email,
      username: u.username,
      id: `m${i + 3}`,
      content: texts[i % texts.length],
      sent_at: new Date(Date.now() - 1000 * 60 * (48 - i)),
      isEdited: Math.random() < 0.15,
    };
  })
];