//Hooks imports
import { showSnackbar } from "@/components/ui/snackbar";

export default async function getTicket(
  team_id: number,
  index: number,
  token: string,
  snackbar: React.RefObject<null>
) {
  const res = await fetch(
    `/api/teams/${team_id}/tickets/${index}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "prismaflow-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        "Authorization": token
      }
    }
  );

  const data = await res.json();

  if(res.status === 200) {
    showSnackbar(data.message, "valid", snackbar);
    return data.ticket;
  }

  showSnackbar(data.message || "Server error", (res.status >= 500 ? "critic" : "warn"), snackbar);
  return;
}