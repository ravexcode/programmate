"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import SnackBar from "@/components/ui/snackbar";
import LoadingScreen from "@/components/screens/loading-screen";

import CalendarSidebar from "./calendar-sidebar";
import CalendarDayEvents from "./calendar-day-events";
import CreateEventModal from "./create-event-modal";
import EditEventModal from "./edit-event-modal";
import DeleteConfirmation from "./delete-confirmation";

import { deleteSessionStr, getSessionStr } from "@/services/session.service";
import { getCached } from "@/utils/cache";
import { getUser } from "@/modules/user.module";
import { getTeam } from "@/modules/project/main.module";
import {
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/modules/project/calendar.module";

import type { UserData } from "@/types/user.types";
import type { CalendarDate } from "@/types/team.types";
import type Team from "@/types/team.types";

export type Months =
  | "January" | "February" | "March" | "April" | "May" | "June"
  | "July" | "August" | "September" | "October" | "November" | "December";

const MONTHS: Months[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Props = {
  projectId: number;
};

export default function Calendar({ projectId }: Props) {
  const router = useRouter();
  const snackbar = useRef(null);

  const [user, setUser] = useState<UserData>();
  const [team, setTeam] = useState<Team>();
  const [isLoading, setIsLoading] = useState(true);

  const now = new Date();
  const [monthNumber, setMonthNumber] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState(now);

  const [showCreator, setShowCreator] = useState(false);
  const [editingEvent, setEditingEvent] = useState<{
    event: CalendarDate;
    index: number;
  } | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<{
    event: CalendarDate;
    index: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      const token = getSessionStr();
      if (!token) {
        router.push("/auth/signin");
        return;
      }

      const cached = getCached();
      const userData = cached ? cached : await getUser(router);

      if (!userData) {
        deleteSessionStr();
        window.localStorage.clear();
        router.push("/auth/signin");
        return;
      }

      if (cancelled) return;
      setUser(userData);

      const teamData = await getTeam({ id: projectId, router, snackbar });
      if (cancelled) return;
      setTeam(teamData);
      setIsLoading(false);
    }

    fetchData();
    return () => { cancelled = true; };
  }, [projectId, router]);

  function handleMonthChange(newMonth: number, newYear: number) {
    setMonthNumber(newMonth);
    setYear(newYear);
  }

  function handleToday() {
    const today = new Date();
    setMonthNumber(today.getMonth());
    setYear(today.getFullYear());
    setSelectedDate(today);
  }

  async function handleCreateEvent(event: CalendarDate) {
    if (!team || !user) return;

    const enriched: CalendarDate = {
      ...event,
      creatorId: user.id ?? "",
      creator: {
        id: user.id ?? "",
        email: user.email ?? "",
        username: user.name ?? "",
        avatar_url: user.avatar_url,
      },
    };

    const success = await createEvent(team.team_id, enriched, snackbar, router);
    if (!success) return;

    setTeam((prev) => {
      if (!prev) return prev;
      const calendar = prev.calendar
        ? [...prev.calendar, enriched]
        : [enriched];
      return { ...prev, calendar };
    });

    setShowCreator(false);
  }

  async function handleUpdateEvent(index: number, event: CalendarDate) {
    if (!team) return;

    const success = await updateEvent(
      team.team_id,
      index,
      event,
      snackbar,
      router,
    );
    if (!success) return;

    setTeam((prev) => {
      if (!prev || !prev.calendar) return prev;
      const updated = [...prev.calendar];
      updated[index] = event;
      return { ...prev, calendar: updated };
    });

    setEditingEvent(null);
  }

  async function handleDeleteEvent(index: number) {
    if (!team) return;

    const success = await deleteEvent(team.team_id, index, snackbar, router);
    if (!success) return;

    setTeam((prev) => {
      if (!prev || !prev.calendar) return prev;
      return {
        ...prev,
        calendar: prev.calendar.filter((_, i) => i !== index),
      };
    });

    setDeletingEvent(null);
  }

  function handleEdit(event: CalendarDate, index: number) {
    setEditingEvent({ event, index });
  }

  function handleDeleteRequest(event: CalendarDate, index: number) {
    setDeletingEvent({ event, index });
  }

  if (isLoading || !team || !user) return <LoadingScreen />;

  return (
    <div className="bg-background text-text h-screen grid grid-cols-[auto_1fr]">
      <SnackBar ref={snackbar} />

      {showCreator && (
        <CreateEventModal
          onSubmit={handleCreateEvent}
          onClose={() => setShowCreator(false)}
        />
      )}

      {editingEvent && (
        <EditEventModal
          event={editingEvent.event}
          onSubmit={(updated) => handleUpdateEvent(editingEvent.index, updated)}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {deletingEvent && (
        <DeleteConfirmation
          title={deletingEvent.event.title}
          onConfirm={() => handleDeleteEvent(deletingEvent.index)}
          onCancel={() => setDeletingEvent(null)}
        />
      )}

      <CalendarSidebar
        teamName={team.name}
        monthName={MONTHS[monthNumber]}
        monthNumber={monthNumber}
        year={year}
        selectedDate={selectedDate}
        events={team.calendar ?? []}
        onMonthChange={handleMonthChange}
        onToday={handleToday}
        onSelectDate={setSelectedDate}
        onOpenCreator={() => setShowCreator(true)}
      />

      <CalendarDayEvents
        events={team.calendar ?? []}
        selectedDate={selectedDate}
        monthName={MONTHS[monthNumber]}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onOpenCreator={() => setShowCreator(true)}
      />
    </div>
  );
}
