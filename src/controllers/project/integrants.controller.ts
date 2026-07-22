const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

//-------- Integrants functions --------

export async function requestIntegrantController(data: { id: number; token: string; reqEmail: string }) {
  const req = await fetch(
    `/api/teams/${data.id}/integrants/request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      body: JSON.stringify({
        requested_email: data.reqEmail
      })
    }
  );

  const response = await req.json()
  .catch((e) => {
    if(e instanceof Error) {
      console.error("Error requesting integrant:", e.cause);

      return {
        message: e.message,
        status: req.status
      }
    }

    return {
      message: "Server error",
      status: 500
    }
  });

  return {
    message: response.message,
    status: req.status
  }
}

export async function changeRoleController(data: { id: number; token: string; memberId: string; newRole: string }) {
  const req = await fetch(
    `/api/teams/${data.id}/integrants/change-role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      body: JSON.stringify({
        member_id: data.memberId,
        new_role: data.newRole
      })
    }
  );

  const response = await req.json()
  .catch((e) => {
    if(e instanceof Error) {
      console.error("Error changing role:", e.cause);

      return {
        message: e.message,
        status: req.status
      }
    }

    return {
      message: "Server error",
      status: 500
    }
  });

  return {
    message: response.message,
    status: req.status
  }
}

export async function removeMemberController(data: { id: number; token: string; memberId: string }) {
  const req = await fetch(
    `/api/teams/${data.id}/integrants/remove-member`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      body: JSON.stringify({
        member_id: data.memberId
      })
    }
  );

  const response = await req.json()
  .catch((e) => {
    if(e instanceof Error) {
      console.error("Error removing member:", e.cause);

      return {
        message: e.message,
        status: req.status
      }
    }

    return {
      message: "Server error",
      status: 500
    }
  });

  return {
    message: response.message,
    status: req.status
  }
}

export async function addIntegrantController(data: { id: number; token: string; member: { id: string; email: string; username: string; type: string; avatar_url?: string } }) {
  const req = await fetch(
    `/api/teams/${data.id}/integrants`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
        "Authorization": data.token
      },
      body: JSON.stringify(data.member)
    }
  );

  const response = await req.json()
  .catch((e) => {
    if(e instanceof Error) {
      console.error("Error adding integrant:", e.cause);

      return {
        message: e.message,
        status: req.status
      }
    }

    return {
      message: "Server error",
      status: 500
    }
  });

  return {
    message: response.message,
    status: req.status
  }
}

export async function searchUsersController(data: { query: string }) {
  const req = await fetch(
    `/api/users/search/${data.query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "nexzero-api-key": API_KEY,
      }
    }
  );

  const response = await req.json()
  .catch((e) => {
    if(e instanceof Error) {
      console.error("Error searching users:", e.cause);

      return {
        message: e.message,
        status: req.status,
        users: []
      }
    }

    return {
      message: "Server error",
      status: 500,
      users: []
    }
  });

  return {
    message: response.message,
    users: response.users || [],
    status: req.status
  }
}
