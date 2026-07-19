//Client side
"use client";

//React imports
import { useEffect, useRef, useState } from "react";

//Next imports
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

//Prebuild UI imports
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import LoadingDashboard from "@/components/screens/loading-screen";
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";
import MainButton from "@/components/ui/buttons/main";
import DateInput from "@/components/forms/date-input";
import OptionsInput from "@/components/forms/options-input";
import AltButton from "@/components/ui/buttons/alternate";
import HazardButton from "@/components/ui/buttons/hazard";

//Hooks imports
import useAnimationClose from "@/hooks/useAnimationClose";
import { deleteSessionStr, getSessionStr } from "@/services/session.service";
import { getCached } from "@/hooks/cache.hook";

//Utils imports
import genDays from "@/utils/gen-days";

//Types imports
import { UserData } from "@/types/user.types";
import Team, { CalendarDate, CalendarDateType, Ticket } from "@/types/team.types";

//Icons imports
import {
  IconArrowLeft,
  IconArrowRight,
  IconAssembly,
  IconCircleFilled,
  IconInfoCircle,
  IconPlus,
  IconUserCircle,
} from "@tabler/icons-react";

//Services imports
import { getUser } from "@/modules/user.module";
import { getTeam } from "@/modules/project/main.module";
import { fetchTemplate } from "@/actions/template";
import Image from "next/image";

type Months = "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December";

export default function CalendarPage() {
  //NextJS Setup
  const params = useParams();
  const router = useRouter();

  //States handler
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Team data
  const [ team, setTeam ] = useState<Team>();

  const [ currMonth, SetCurrMonth ] = useState<Months>("January");
  const [ currMonthNumber, setCurrMonthNumber ] = useState(1);
  const [ currDay, setCurrDay ] = useState(1);
  const [ currYear, setCurrYear ] = useState(1);
  const [ now, setNow ] = useState<Date>(new Date());
  const [ days, setDays ] = useState<{
    num: number,
    month_index: number
    isOff: boolean
  } []>();
  const [ daySel, setDaySel ] = useState<Date>(new Date());

  const [ eventTitle, setEventTitle ] = useState("");
  const [ eventDescription, setEventDescription ] = useState("");
  const [ daySet, setDaySet ] = useState<string>((new Date()).toDateString());
  const [ type, setType ] = useState("deadline");
  const [ color, setColor ] = useState("blue");

  //Ref Objects
  //Snackbar data
  const snackbar = useRef(null);

  //Constraints
  const months: Months [] = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]

  const form_creator = useRef(null);

  useEffect(() => {
    async function fetchData() {
      let user_data: UserData;

      const token = getSessionStr();

      if(!token) return router.push("/auth/signin");

      const cached = getCached();

      if(!cached) {
        const user_fetched = await getUser({router});

        if(!user_fetched) {
          deleteSessionStr();
          window.localStorage.clear();
          return router.push("/auth/signin");
        }

        user_data = user_fetched
      } else {
        user_data = cached;
      }

      setUser(user_data);

      const team = await getTeam(
        { id: Number(params.id), token, snackbar: snackbar }
      );

      setTeam(team);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const now_date = new Date();

    setNow(now_date);
    SetCurrMonth(months[now_date.getMonth()]);
    setCurrMonthNumber(now_date.getMonth())
    setCurrDay(now_date.getDay());
    setCurrYear(now_date.getFullYear());
    setDays(genDays(
      now_date.getFullYear(),
      now_date.getMonth()
    ));
  }, []);

  const toggleFormCreator = () => {
    if(!form_creator.current) return;

    const current : HTMLElement = form_creator.current;
    const classlist = current.classList;

    if(classlist.contains("hidden")){
      classlist.remove("animate-fade-out-down");
      classlist.replace("hidden", "flex");

      return;
    };

    classlist.add("animate-fade-out-down");
    useAnimationClose(current, "fade-out-down", "hidden", "flex");
    return;
  };

  const defaultDates: CalendarDate [] = [
    {
      title: "Sprint Planning",
      description: "Define tasks and priorities for the next sprint.",
      creatorId: "usr_001",
      creator: {
        id: "usr_001",
        username: "Ravexcode",
        email: "ravexcode@gmail.com",
        avatar_url: "https://avatars.githubusercontent.com/u/195974083?v=4"
      },
      type: "meeting",
      date: new Date("2026-07-03T10:00:00"),
      color: "blue",
    },
    {
      title: "Authentication Module Deadline",
      description: "Complete JWT authentication and refresh token implementation.",
      creatorId: "usr_002",
      creator: {
        id: "usr_002",
        username: "Alice",
        email: "alice@gmail.com"
      },
      type: "deadline",
      date: new Date("2026-07-05T23:59:00"),
      color: "red",
    },
    {
      title: "Review Pull Request #84",
      description: "Review the new Kanban board improvements.",
      creatorId: "usr_003",
      creator: {
        id: "usr_003",
        username: "Carlos",
        email: "carlos@gmail.com"
      },
      type: "request",
      date: new Date("2026-07-04T15:30:00"),
      color: "orange",
    },
    {
      title: "Backend Architecture Meeting",
      description: "Discuss NestJS modules and project structure.",
      creatorId: "usr_004",
      creator: {
        id: "usr_004",
        username: "Emma",
        email: "emma@gmail.com",
        avatar_url: "/example/emma.jpeg"
      },
      type: "online-meeting",
      date: new Date("2026-07-06T09:00:00"),
      color: "cyan",
    },
    {
      title: "Start UI Redesign",
      description: "Begin implementing the new dashboard interface.",
      creatorId: "usr_001",
      creator: {
        id: "usr_001",
        username: "Ravexcode",
        email: "ravexcode@gmail.com",
        avatar_url: "https://avatars.githubusercontent.com/u/195974083?v=4"
      },
      type: "target-start",
      date: new Date("2026-07-07T08:00:00"),
      color: "teal",
    },
    {
      title: "Database Migration Deadline",
      description: "Finish migrating data to the new Prisma schema.",
      creatorId: "usr_005",
      creator: {
        id: "usr_005",
        username: "Lucas",
        email: "lucas@gmail.com",
        avatar_url: "/example/lucas.jpeg"
      },
      type: "deadline",
      date: new Date("2026-07-08T18:00:00"),
      color: "violet",
    },
    {
      title: "Client Feedback Session",
      description: "Present the latest prototype and gather feedback.",
      creatorId: "usr_006",
      creator: {
        id: "usr_006",
        username: "Sophia",
        email: "sophia@gmail.com"
      },
      type: "meeting",
      date: new Date("2026-07-09T14:00:00"),
      color: "yellow",
    },
    {
      title: "Approve New Workspace",
      description: "Workspace creation request awaiting approval.",
      creatorId: "usr_007",
      creator: {
        id: "usr_007",
        username: "Daniel",
        email: "daniel@gmail.com",
        avatar_url: "/example/daniel.jpeg"
      },
      type: "request",
      date: new Date("2026-07-10T11:00:00"),
      color: "purple",
    },
    {
      title: "Marketing Sync",
      description: "Coordinate launch timeline with the marketing team.",
      creatorId: "usr_008",
      creator: {
        id: "usr_008",
        username: "Olivia",
        email: "olivia@gmail.com",
        avatar_url: "/example/olivia.jpeg"
      },
      type: "online-meeting",
      date: new Date("2026-07-11T16:30:00"),
      color: "rose",
    },
    {
      title: "Prepare Release Candidate",
      description: "Start stabilizing the project for the next release.",
      creatorId: "usr_009",
      creator: {
        id: "usr_009",
        username: "Noah",
        email: "noah@gmail.com"
      },
      type: "target-start",
      date: new Date("2026-07-12T09:30:00"),
      color: "neutral",
    },
  ];

  return (
    team && user ? (
    <div
    className="bg-background text-text h-screen grid grid-cols-[auto_1fr]">
      <SnackBar
      ref={snackbar} />

      { /* Creator form */ }
      <div
      className="fixed hidden items-start justify-center p-10 z-10 backdrop-blur backdrop-brightness-50 w-screen h-screen animate-fade-in-up animate-duration-300"
      ref={form_creator}
      onClick={toggleFormCreator}>
        <CreatorForm
        action={() => {}}
        title="Create a new event"
        actionIsDisabled={
          !eventTitle ||
          !daySet
        }
        disabledMessage="You need to set required fields"
        hideAction={toggleFormCreator} >

          <CreatorInput
          label="Set a new title"
          placeholder="e.g. API Refactor deadline"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value ?? "")}
          required />

          <CreatorInput
          type="textarea"
          label="Set the description"
          placeholder="e.g. Make the refactor for the API endpoint named..."
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value ?? "")} />

          <DateInput
          value={daySet}
          onChange={(e) => setDaySet(e.target.value)}
          label="Insert date"
          required />

          <OptionsInput
          label="Set type"
          value={type}
          onChange={setType}
          options={[
            "deadline",
            "meeting",
            "request",
            "online-meeting",
            "target-start"
          ]} />

          <OptionsInput
          label="Set color"
          value={color}
          onChange={setColor}
          options={[
            "blue",
            "cyan",
            "teal",
            "yellow",
            "orange",
            "red",
            "violet",
            "purple",
            "rose",
            "neutral"
          ]} />

          <div
          className="h-3 w-full block" />
        </CreatorForm>
      </div>

      <aside
      className="h-full flex flex-col items-center justify-start bg-neutral-900 p-4 w-120">
        {/* Back button */}
        <button
        type="button"
        onClick={() => router.back()}
        className="w-max mb-2 mr-auto py-2 px-4 rounded-md hover:bg-neutral-700 flex gap-2 items-center justify-center text-sm cursor-pointer duration-300">
          <IconArrowLeft
          size={15} />
          Go back
        </button>

        <p
        className="text-3xl font-medium tracking-wide w-full text-start">
          { team.name.slice(0, 1).toUpperCase() + team.name.slice(1, team.name.length).toLowerCase() } calendar
        </p>

        {/* Event creator */}
        <MainButton
        size="w-full"
        className="mt-5 flex gap-1 items-center justify-center"
        action={toggleFormCreator}>
          <IconPlus
          size={15}
          stroke={3.5} />
          <p
          className="text-base font-medium">
            Set a new event
          </p>
        </MainButton>

        {/* Calendar logic */}

        {/* Movement buttons */}
        <div
        className="w-full flex items-center justify-between mt-8">
          <p
          className="text-lg font-medium tracking-wide">
            { currMonth } {" "}
            { currYear }
          </p>

          {/* Buttons */}
          <div
          className="flex gap-1 items-center justify-center">
            <button
            type="button"
            className="px-4 py-2 rounded-md duration-300 hover:bg-neutral-700 cursor-pointer text-sm"
            onClick={() => {
              if(!now) return;

              SetCurrMonth(months[now.getMonth()]);
              setCurrMonthNumber(now.getMonth())
              setCurrDay(now.getDay());
              setCurrYear(now.getFullYear());
              setDays(genDays(
                now.getFullYear(),
                now.getMonth()
              ));
              setDaySel(now);
            }}>
              Now
            </button>

            <button
            type="button"
            className="p-2.5 rounded-full duration-300 hover:bg-neutral-700 cursor-pointer"
            onClick={() => {
              const month_num: number = currMonthNumber > 0 ? currMonthNumber - 1 : 11;
              setCurrMonthNumber(month_num);
              SetCurrMonth(months[month_num]);
              setDays(genDays(
                month_num === 11 ? currYear - 1 : currYear,
                month_num
              ));

              if(month_num === 11) return setCurrYear(prev => prev - 1);
            }}>
              <IconArrowLeft
              size={15} />
            </button>

            <button
            type="button"
            className="p-2.5 rounded-full duration-300 hover:bg-neutral-700 cursor-pointer"
            onClick={() => {
              const month_num: number = currMonthNumber < 11 ? currMonthNumber + 1 : 0;

              setCurrMonthNumber(month_num);
              SetCurrMonth(months[month_num]);
              setDays(genDays(
                month_num === 11 ? currYear - 1 : currYear,
                month_num
              ));

              if(month_num === 0) return setCurrYear(prev => prev + 1);
            }}>
              <IconArrowRight
              size={15} />
            </button>
          </div>
        </div>

        <section
        className="w-full rounded-md bg-neutral-800 mt-3 flex flex-col items-center justify-around p-2 py-4">
          {/* Days */}
          <div
          className="grid grid-cols-7 w-full font-medium text-center mb-4 uppercase">
            <p> M </p>
            <p> T </p>
            <p> W </p>
            <p> T </p>
            <p> F </p>
            <p> S </p>
            <p> S </p>
          </div>
          
          {/* Days */}
          <div
          className="grid grid-cols-7 w-full font-medium text-center justify-center items-center gap-3">
            {
              days && days.map((day, index) =>
                <p
                key={currMonth + index}
                className={`
                  aspect-square
                  flex items-center justify-center
                  rounded-lg
                  text-sm
                  transition-all duration-200
                  cursor-pointer
                  hover:scale-105
                  ${
                    day.isOff
                      ? "text-neutral-600"
                      : "text-neutral-100"
                  }
                  ${
                    (daySel.getMonth() === day.month_index &&
                    daySel.getDate() === day.num &&
                    daySel.getFullYear() === currYear) ?
                    "bg-main hover:bg-blue-900" :
                    "hover:bg-neutral-700"
                  }
                `}
                onClick={() => {
                  const thisDay = new Date(
                    currYear,
                    currMonthNumber,
                    day.num
                  );

                  setDaySel(thisDay);
                  return;
                }}>
                  { day.num }
                </p>
              )
            }
          </div>
        </section>
      </aside>

      <main
      className="w-full flex flex-col h-full p-5 px-10">
        <p
        className="text-4xl tracking-wide mb-8">
          {
            months[daySel.getMonth()] + " "
          }
          {
            daySel.getDate() + " "
          }
          {
            daySel.getFullYear()
          }
        </p>

        {
          //team.calendar && team.calendar.map(
          team.calendar && team.calendar.map(
            ( calEvent, index ) =>
              calEvent.date.getMonth() === daySel.getMonth() &&
              calEvent.date.getDate() === daySel.getDate()  &&
              calEvent.date.getFullYear() === daySel.getFullYear() &&
                <section
                key={"Event #" + index}
                className="w-full rounded-sm bg-neutral-900 py-2 px-6 flex flex-col justify-center items-center my-2 animate-fade-in-down animate-duration-200">

                  <div
                  className="w-full rounded-sm bg-neutral-900 flex gap-2 justify-center items-center my-2">
                    <IconCircleFilled
                    size={15}
                    color={calEvent.color} />

                    <div
                    className="gap-1 flex flex-col w-full items-center justify-center text-start ml-2">
                      <p
                      className="font-medium tracking-wide text-start w-full">
                        { calEvent.title }
                      </p>
                      <p
                      className="text-sm text-start w-full opacity-80">
                        { calEvent.description }
                      </p>
                    </div>

                    <button
                    type="button"
                    className="w-">

                    </button>
                  </div>

                  <div
                  className="w-full flex gap-2 items-center pb-2">
                    {
                      calEvent.creator.avatar_url ? 
                        <Image
                        src={calEvent.creator.avatar_url}
                        alt={calEvent.creator.username + " profile picture"}
                        width={50}
                        height={50}
                        className="rounded-full aspect-square block w-6" />
                        :
                        <IconUserCircle
                        size={30}
                        className="rounded-full aspect-square block w-6" />
                    }

                    <p> { calEvent.creator.username } </p>

                    <p
                    className="opacity-60 text-sm"> { calEvent.creator.email } </p>
                  </div>

                  <p
                  className="text-sm opacity-60 w-full text-start">
                    UUID: { calEvent.creator.id }
                  </p>
                </section>
          )
        }
      </main>
    </div>
    ): ( <LoadingDashboard /> )
  )
}