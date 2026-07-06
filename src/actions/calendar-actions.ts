import { CalendarDate } from "@/types/team.types";
import { fetchTemplate } from "@/actions/template";
import { RefObject } from "react";

export async function createEvent(
  team_id: number,
  eventData: CalendarDate,
  snackbar: RefObject<null>,
  token: string
) {
  const url = `/api/teams/${team_id}/calendar`;
  const body = JSON.stringify(eventData);

  const res = await fetchTemplate(
    url,
    "POST", 
    snackbar,
    { "Authorization": token },
    body
  );
  
  if(res.data) return res.data;

  return;
}

export async function updateEvent(
  team_id: number,
  event_index: number,
  eventData: CalendarDate,
  snackbar: RefObject<null>,
  token: string
) {
  const url = `/api/teams/${team_id}/calendar/${event_index}`;
  const body = JSON.stringify(eventData);

  const res = await fetchTemplate(
    url, 
    "PUT", 
    snackbar,
    { "Authorization": token }, 
    body
  );

  if(res.data) return res.data;

  return;
}