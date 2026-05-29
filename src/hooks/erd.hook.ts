//Types
//Imports
import Team from "@/types/team.types";

//Updater hook
export async function saveERD(
  teamID: any,
  erd: any,
  connections: Array<{
    connector: {
      table: string;
      row: string;
    };
    connected: {
      table: string;
      row: string;
    };
    type: "oto" | "mto" | "mtm";
  }>,
  token: string,
  snackBar: any
) {
  if(!erd || erd.length <= 0) return;

  if(!token) {
    window.location.href = "/";
    return;
  }

  const res = await fetch(`/api/teams/${teamID}/erd`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!
    },
    body: JSON.stringify({
      erd: erd,
      connections: connections,
      teamId: teamID
    })
  });

  const data = await res.json();

  if(res.status === 200) {
    snackBar.current.showSnackBar(data.message);
    return;
  }

  snackBar.current.showSnackBar(data.message, true);
  return;
}

export async function getERD(
  teamId: any,
  token: string
) {
  if(!token) {
    window.location.href = "/";
    return;
  }
  
  const res = await fetch(`/api/teams/${teamId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!
    },
  });

  const data = await res.json();

  if(res.status === 200) {
    const team : Team = data.team;
    return {
      tables: team.ERD || [],
      connections: team.ERD_connections || []
    };
  }

  return;
}