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
import TeamSidebar from "@/components/ui/dashboard/team-sidebar";
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";
import MainButton from "@/components/ui/buttons/main";
import BgGradient from "@/components/ui/bg-gradient";
import TicketCard from "@/components/ui/ticket-card";

//Hooks imports
import useAnimationClose from "@/hooks/useAnimationClose";
import { useDeleteToken, useGetToken } from "@/hooks/useCookies";
import { getCached } from "@/hooks/cache.hook";

//Types imports
import { UserData } from "@/types/user.types";
import Team, { Ticket } from "@/types/team.types";

//Icons imports
import {
  IconAssembly,
  IconCircleFilled,
  IconInfoCircle,
} from "@tabler/icons-react";

//Services imports
import getUser from "@/services/user.service";
import getTeam from "@/services/team.service";
import AltButton from "@/components/ui/buttons/alternate";
import HazardButton from "@/components/ui/buttons/hazard";
import { fetchTemplate } from "@/actions/template";

export default function CalendarPage() {
  //NextJS Setup
  const params = useParams();
  const router = useRouter();

  //States handler
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Team data
  const [ team, setTeam ] = useState<Team>();

  //Ref Objects
  //Snackbar data
  const snackbar = useRef(null);

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

  return (
    team && user ? (
    <div
    className="bg-background text-text h-screen grid grid-cols-[auto_1fr]">

    </div>
    ): ( <LoadingDashboard /> )
  )
}