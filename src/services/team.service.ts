//Hooks imports
import { showSnackbar } from "@/components/ui/snackbar";

export default async function getTeam(
  team_id: number,
  token: string,
  snackbar: React.RefObject<null>,
) {
  const res = await fetch(
    `/api/teams/${team_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        "Authorization": token
      }
    }
  );

  const data = await res.json();

  if(res.status === 200) {
    showSnackbar(data.message, "valid", snackbar);
    return data.team;
  }

  showSnackbar(data.message || "Server error", (res.status >= 500 ? "critic" : "warn"), snackbar);
  return;
}