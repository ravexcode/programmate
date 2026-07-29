"use client";

import { useParams } from "next/navigation";
import Calendar from "@/components/project/calendar/calendar";

export default function CalendarPage() {
  const params = useParams();
  const projectId = Number(params.id);

  return <Calendar projectId={projectId} />;
}
