//Types imports
import Team, { ERDTable } from "@/types/team.types";

//Updater hook
export async function saveERD(
  teamID: any,
  erd: Array<ERDTable>,
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
      erd: erd
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
    return team.ERD;
  }

  return;
}