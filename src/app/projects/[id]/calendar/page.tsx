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
import { useDeleteToken, useGetToken } from "@/hooks/useCookies";
import { getCached } from "@/hooks/cache.hook";

//Utils imports
import genDays from "@/utils/gen-days";

//Types imports
import { UserData } from "@/types/user.types";
import Team, { CalendarDateType, Ticket } from "@/types/team.types";

//Icons imports
import {
  IconArrowLeft,
  IconArrowRight,
  IconAssembly,
  IconCircleFilled,
  IconInfoCircle,
  IconPlus,
} from "@tabler/icons-react";

//Services imports
import getUser from "@/services/user.service";
import getTeam from "@/services/team.service";
import { fetchTemplate } from "@/actions/template";

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

      const token = useGetToken();

      if(!token) return router.push("/auth/login");

      const cached = getCached();

      if(!cached) {
        const user_fetched = await getUser(token);

        if(!user_fetched) {
          useDeleteToken();
          window.localStorage.clear();
          return router.push("/auth/login");
        }

        user_data = user_fetched
      } else {
        user_data = cached;
      }

      setUser(user_data);

      const team = await getTeam(
        Number(params.id),
        token,
        snackbar
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
  }

  return (
    team && user ? (
    <div
    className="bg-background text-text h-screen grid grid-cols-[auto_1fr]">
      <SnackBar
      ref={snackbar} />

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
              let month_num: number = currMonthNumber > 0 ? currMonthNumber - 1 : 11;
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
              let month_num: number = currMonthNumber < 11 ? currMonthNumber + 1 : 0;

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
        className="text-4xl tracking-wide">
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
          team.calendar && team.calendar.map(
            ( calEvent, index ) =>
              calEvent.date === daySel && 
                <section
                key={"Event #" + index}
                className="w-full rounded-sm bg-neutral-900 p-2 flex gap-2 justify-center items-center">
                  <IconCircleFilled
                  size={15}
                  color={calEvent.color} />

                  <div
                  className="gap-1 flex flex-col w-full items-center justify-center text-start">
                    <p
                    className="text-lg font-medium tracking-wide text-start">
                      { calEvent.title }
                    </p>
                    <p
                    className="text-lg font-medium tracking-wide text-start">
                      { calEvent.description }
                    </p>
                  </div>

                  <button
                  type="button"
                  className="w-">

                  </button>
                </section>
          )
        }
      </main>
    </div>
    ): ( <LoadingDashboard /> )
  )
}