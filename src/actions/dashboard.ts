//Hooks imports
import { useRouter } from "next/navigation";
import { useDeleteToken, useGetToken } from "@/hooks/useCookies";
import { showSnackbar } from "@/components/ui/snackbar";

//Types imports
import { UserData } from "@/types/user.types";
import Team, { IntegrantData } from "@/types/team.types";
import type { Status } from "@/app/dashboard/page";

interface Project {
  name: string;
  description: string;
  integrants: IntegrantData [];
  status: Status;
  tags: string [];
}

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

export async function createProject(
  e: React.SubmitEvent<HTMLFormElement>,
  project: Project,
  snackbar: React.RefObject<null>,
  user: UserData
) {
  e.preventDefault();
  const router = useRouter();

  const token = useGetToken();

  if(!token) return logOut();

  const res = await fetch(
    "/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "prismaflow-api-key": process.env.NEXT_PUBLIC_API_KEY!
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
    "We get some errors, try again later",
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

    return router.push(`/teams/${data.team.team_id}`);
  };

  return showSnackbar(
    data.message,
    checkStatus(res.status),
    snackbar
  );
}