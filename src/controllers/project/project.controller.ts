//Hooks imports
import { useRouter } from "next/navigation";
import { useDeleteToken, useGetToken } from "@/hooks/useCookies";
import { showSnackbar } from "@/components/ui/snackbar";

//Types
//Imports
import { UserData } from "@/types/user.types";
import Team, { IntegrantData } from "@/types/team.types";
import type { Status } from "@/app/dashboard/page";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
//Alter types
interface Project {
  name: string;
  description: string;
  integrants: IntegrantData [];
  status: Status;
  tags: string [];
}

//Misc functions
function logOut() {
  const router = useRouter();

  useDeleteToken();
  window.localStorage.clear();

  return router.push("/auth/login");
}
function checkStatus(status: number) {
  if(status >= 500) return "critic";

  return "warn";
}
function verify(){
  const token = useGetToken();
  if(!token) return logOut();
  return token;
}

//Main functions
export async function createProject(
  e: React.SubmitEvent<HTMLFormElement>,
  project: Project,
  snackbar: React.RefObject<null>,
  user: UserData
) {
  e.preventDefault();
  const router = useRouter();

  const token = verify();

  const res = await fetch(
    "/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "prismaflow-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        "Authorization": token!
      },
      body: JSON.stringify(project)
    }
  );

  const data: undefined | {
    message: string,
    error?: string,
    team?: Team
  } = await res.json();

  if(!data) return showSnackbar(
    "Server error, try again later",
    "critic",
    snackbar
  );

  if(res.status === 401) return logOut();

  if(res.ok && data.team) {
    const updated: UserData = {
      ...user,
      teams: [
        ...user.teams || [],
        data.team
      ]
    };
    
    window.localStorage.setItem("user", JSON.stringify(updated));

    return router.push(`/projects/${data.team.team_id}`);
  };

  return showSnackbar(
    data.message,
    checkStatus(res.status),
    snackbar
  );
}

export async function updateProject(
  e: React.SubmitEvent<HTMLFormElement>,
  project: Team,
  snackbar: React.RefObject<null>,
  user: UserData,
  router: AppRouterInstance
) {
  e.preventDefault();

  const token = verify();

  const res = await fetch(
    "/api/teams", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "prismaflow-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        "Authorization": token!
      },
      body: JSON.stringify({
        teamId: project.team_id,
        newName: project.name,
        newDescription: project.description,
        newStatus: project.status,
        newTags: project.tags || [],
      })
    }
  );

  const data: undefined | {
    message: string,
    error?: string
  }= await res.json();

  if(!data) return showSnackbar(
    "Server error, try again later",
    "critic",
    snackbar
  );

  console.log(data);

  if(res.status === 401) return router.push("/dashboard");

  if(res.ok) {
    const updated: UserData = {
      ...user,
      teams: (user.teams || []).filter(
        t => {
          if(t.team_id !== project.team_id) return t;

          return project;
        }
      )
    };
    
    window.localStorage.setItem("user", JSON.stringify(updated));

    return showSnackbar(
      data.message,
      "valid",
      snackbar
    );
  };

  return showSnackbar(
    data.message,
    checkStatus(res.status),
    snackbar
  );
}

export async function deleteProject(
  index: number,
  user: UserData,
  verification: string,
  project: Team,
  snackbar: React.RefObject<null>
) {
  if(verification !== project.name) return;

  const token = verify();
  const router = useRouter();

  const res = await fetch(
    `/api/teams/${project.team_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "prismaflow-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        "Authorization": token!
      }
    }
  );

  const data: undefined | {
    message: string,
    error?: string
  } = await res.json();

  if(!data) return showSnackbar(
    "Server error, try again later",
    "critic",
    snackbar
  );

  if(res.status === 401) return router.push("/dashboard");

  if(res.ok) {
    const updated: UserData = {
      ...user,
      teams: (user.teams || []).filter(
        (_, i) => i !== index
      )
    };
    
    window.localStorage.setItem("user", JSON.stringify(updated));

    return router.push("/dashboard");
  };

  return showSnackbar(
    data.message,
    checkStatus(res.status),
    snackbar
  );  
}