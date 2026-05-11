import { SnackbarRef } from "@/components/ui/snackbar";

export async function sendRequest(
  requested_email: string,
  team_id: string,
  token: string,
  snackbar: React.RefObject<SnackbarRef | null>
){
  //Response from api
  const res = await fetch(
    `/api/teams/${team_id}/integrants/request`,
    {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
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
    snackbar.current?.showSnackBar(
      data.message
    );
  }

  snackbar.current?.showSnackBar(
    data.message || "Server error",
    true
  );
};

export async function sendLoginWarn(
  email: string
){

}