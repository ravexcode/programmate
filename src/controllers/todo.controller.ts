const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

type CreateTodoData = {
  token: string;
  list_title: string;
  list_description: string;
  tags: string[];
};

type UpdateTodoData = {
  token: string;
  list_index: number;
  title: string;
  description: string;
  tags: string[];
};

type DeleteTodoData = {
  token: string;
  list_index: number;
};

export async function createTodo(data: CreateTodoData) {
  const req = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "nexzero-api-key": API_KEY,
      "Authorization": data.token,
    },
    body: JSON.stringify({
      list_title: data.list_title,
      list_description: data.list_description,
      tags: data.tags,
    }),
  });

  const response = await req.json().catch((e) => {
    if (e instanceof Error) {
      return {
        message: e.message,
        error: true,
      };
    }

    return {
      message: "Server error",
      error: true,
    };
  });

  return {
    message: response.message,
    error: response.error,
    status: req.status,
  };
}

export async function updateTodo(data: UpdateTodoData) {
  const req = await fetch("/api/todos", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "nexzero-api-key": API_KEY,
      "Authorization": data.token,
    },
    body: JSON.stringify({
      list_index: data.list_index,
      content: {
        title: data.title,
        description: data.description,
        tags: data.tags,
      },
    }),
  });

  const response = await req.json().catch((e) => {
    if (e instanceof Error) {
      return {
        message: e.message,
        error: true,
      };
    }

    return {
      message: "Server error",
      error: true,
    };
  });

  return {
    message: response.message,
    error: response.error,
    status: req.status,
  };
}

export async function deleteTodo(data: DeleteTodoData) {
  const req = await fetch("/api/todos", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "nexzero-api-key": API_KEY,
      "Authorization": data.token,
    },
    body: JSON.stringify({
      list_index: data.list_index,
    }),
  });

  const response = await req.json().catch((e) => {
    if (e instanceof Error) {
      return {
        message: e.message,
        error: true,
      };
    }

    return {
      message: "Server error",
      error: true,
    };
  });

  return {
    message: response.message,
    error: response.error,
    status: req.status,
  };
}
