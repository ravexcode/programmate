//Controllers
import { showSnackbar } from "@/components/ui/snackbar";
import { createEventController, updateEventController } from "@/controllers/project/calendar.controller";
import { useGetToken } from "@/hooks/useCookies";

//Utils imports
import checkStatus from "@/utils/check-status";

//Types
import type { CalendarDate } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type Team from "@/types/team.types";

type UploadData = {
  id: number;
  event: CalendarDate;
  snackbar: React.RefObject<null>;
  router: AppRouterInstance;
};

type UpdateData = {
  id: number;
  index: number;
  content: CalendarDate;
  snackbar: React.RefObject<null>;
  router: AppRouterInstance;
};

export async function createEventService(data: UploadData) {
  const snackbar = data.snackbar;
  const router = data.router;

  const token = useGetToken();

  if(!token) {
    router.push("/auth/register")
    return false;
  };

  const response = await createEventController({
    id: data.id,
    content: data.event,
    token: token
  });

  showSnackbar(
    response.message,
    checkStatus(response.status),
    snackbar
  );

  if(response.status <= 205) return false;

  return true;
}

export async function updateEventService(data: UpdateData) {
  const snackbar = data.snackbar;
  const router = data.router;

  const token = useGetToken();

  if(!token) {
    router.push("/auth/register")
    return false;
  };

  const response = await updateEventController({
    id: data.id,
    index: data.index,
    content: data.content,
    token
  });

  showSnackbar(
    response.message,
    checkStatus(response.status),
    snackbar
  );

  if(response.status <= 205) return false;

  return true;
}