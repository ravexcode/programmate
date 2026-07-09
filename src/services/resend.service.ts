import { showSnackbar } from "@/components/ui/snackbar";

export async function sendRequest(
  requested_email: string,
  team_id: string,
  token: string,
  snackbar: React.RefObject<null>
){
  //Response from api
  const res = await fetch(
    `/api/teams/${team_id}/integrants/request`,
    {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        "prismaflow-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        "Authorization": token
      },
      body: JSON.stringify({
        requested_email
      })
    }
  );

  //Data content from res
  const data = await res.json();

  //Verifies status
  if(res.status === 200) {
    showSnackbar(data.message, "valid", snackbar)
  }

  showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar);
};

export async function sendLoginWarn(
  email: string
){

}