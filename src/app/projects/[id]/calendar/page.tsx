"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import SnackBar from "@/components/ui/snackbar";
import LoadingScreen from "@/components/screens/loading-screen";

import CalendarSidebar from "./components/calendar-sidebar";
import CalendarDayEvents from "./components/calendar-day-events";
import CreateEventModal from "./components/create-event-modal";

import { deleteSessionStr, getSessionStr } from "@/services/session.service";
import { getCached } from "@/hooks/cache.hook";
import { getUser } from "@/modules/user.module";
import { getTeam } from "@/modules/project/main.module";
import { createEvent, deleteEvent } from "@/modules/project/calendar.module";

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

export default function CalendarPage() {
  const params = useParams();
  const router = useRouter();
  const snackbar = useRef(null);

  const [user, setUser] = useState<UserData>();
  const [team, setTeam] = useState<Team>();
  const [showCreator, setShowCreator] = useState(false);

  const now = new Date();
  const [monthNumber, setMonthNumber] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState(now);

  useEffect(() => {
    async function fetchData() {
      const token = getSessionStr();
      if (!token) return router.push("/auth/signin");

      const cached = getCached();

      const userData = cached
        ? cached
        : await getUser(router);

      if (!userData) {
        deleteSessionStr();
        window.localStorage.clear();
        return router.push("/auth/signin");
      }

      setUser(userData);

      const teamData = await getTeam({
        id: Number(params.id),
        router,
        snackbar,
      });

      setTeam(teamData);
    }

    fetchData();
  }, [params.id, router]);

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
    if (!team) return;

    const enriched: CalendarDate = {
      ...event,
      creatorId: user?.id ?? "",
      creator: {
        id: user?.id ?? "",
        email: user?.email ?? "",
        username: user?.name ?? "",
        avatar_url: user?.avatar_url,
      },
    };

    const success = await createEvent(team.team_id, enriched, snackbar, router);

    if (success && team.calendar) {
      setTeam({ ...team, calendar: [...team.calendar, enriched] });
    }
  }

  async function handleDeleteEvent(index: number) {
    if (!team) return;

    const success = await deleteEvent(team.team_id, index, snackbar, router);

    if (success && team.calendar) {
      const updated = team.calendar.filter((_, i) => i !== index);
      setTeam({ ...team, calendar: updated });
    }
  }

  if (!team || !user) return <LoadingScreen />;

  return (
    <div className="bg-background text-text h-screen grid grid-cols-[auto_1fr]">
      <SnackBar ref={snackbar} />

      {showCreator && (
        <CreateEventModal
          onSubmit={handleCreateEvent}
          onClose={() => setShowCreator(false)}
        />
      )}

      <CalendarSidebar
        teamName={team.name}
        monthName={MONTHS[monthNumber]}
        monthNumber={monthNumber}
        year={year}
        selectedDate={selectedDate}
        onMonthChange={handleMonthChange}
        onToday={handleToday}
        onSelectDate={setSelectedDate}
        onOpenCreator={() => setShowCreator(true)}
      />

      <CalendarDayEvents
        events={team.calendar ?? []}
        selectedDate={selectedDate}
        monthName={MONTHS[monthNumber]}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
