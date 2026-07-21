"use client";

//Next imports
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

//Prebuilt UI imports
import LoadingScreen from "@/components/screens/loading-screen";
import PageLayout from "@/components/layouts/page";
import BgGradient from "@/components/ui/bg-gradient";

//React imports
import { useEffect, useRef, useState } from "react";

//Actions imports
import { fetchTemplate } from "@/actions/template";

//Types imports
import type { UserData } from "@/types/user.types";
import Team from "@/types/team.types";
import Link from "next/link";
import { IconArrowLeft, IconUserCircle } from "@tabler/icons-react";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();

  //User data
  const [user, setUser] = useState<UserData | null>(null);
  //Not found status
  const [ notFound, setNotFound ] = useState(false);

  //Componentes
  const snackbar = useRef(null);

  //Constraints
  const cardClasses = "w-full rounded-md bg-neutral-950 border border-neutral-800 p-4 flex gap-2 duration-300 hover:border-main items-center z-2 animate-fade-in-up animate-duration-500";
  
  //Gets user data
  useEffect(() => {
    async function getUser() {
      const data = await fetchTemplate(
        `/api/users/${params.id}`,
        "GET",
        snackbar
      );

      if(!data) return setNotFound(true);

      const user_fetched = data.user;

      let plan = "Free";

      if(data.payments && data.payments.length >= 1) {
        const lastPayment = data.payments[data.payments.length - 1];
        const expires = new Date(lastPayment.paid_at);
        expires.setDate(expires.getDate() + 30);
        const now = new Date();

        if(now <= expires) {
          plan = lastPayment.plan;
          plan = plan.replaceAll('"', '');
          plan = plan.charAt(0).toUpperCase() + plan.slice(1);
        }
      }

      const user_processed : UserData = {
        id: user_fetched.id,
        email: user_fetched.email,
        name: user_fetched.display_name,
        created_at: user_fetched.created_at,
        avatar_url: user_fetched.avatar_url,
        plan,
        teams: data.teams
      }

      setUser(user_processed);
    }

    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    user ? (
      <div
      className="w-full bg-background grid h-screen">

        <main
        className="w-full min-h-max h-full px-2 py-10 relative animate-fade-in animate-duration-250">
          <BgGradient />

          <section
          className="w-full flex flex-col gap-3 p-2 max-w-250 mx-auto z-2">

            <button
            onClick={() => router.back()}
            className="w-max p-1 px-4 rounded-full duration-400 hover:bg-neutral-700 cursor-pointer flex gap-2 text-center items-center justify-center text-sm">
              <IconArrowLeft size={12} stroke={3} />
              Go back
            </button>

            { /* User's profile */ }
            <article
            className={cardClasses + " flex-col"}>
              <div
              className="flex gap-2 w-full">
                {
                  user.avatar_url ? (
                    <Image
                    src={user.avatar_url}
                    alt={user.name + "Profile picture"}
                    width={50}
                    height={50}
                    className="rounded-full aspect-square w-15" />
                  ) : (
                    <IconUserCircle
                    size={50}
                    stroke={1}
                    className="aspect-square w-15" />
                  )
                }

                <div
                className="flex flex-col gap-1 w-full">
                  <div
                  className="flex w-full gap-2">
                    <p className="font-medium tracking-wide"> {user.name} </p>
                    {
                      user.plan !== "free" && (
                        <span className="px-4 text-center rounded-full bg-main shadow-xl shadow-main/30 text-sm h-full flex justify-center items-center scale-75"> {user.plan} </span>
                      )
                    }
                  </div>
                  <p className="text-neutral-400 text-sm"> {user.email} </p>
                </div>
              </div>

              <p
              className="text-neutral-400 w-full text-sm">
                Created at: {(new Date(user.created_at)).toDateString()} <br />
                UUID: {user.id}
              </p>
            </article>

            {/* User's projects */}

            {
              user.teams && (
                <article
                className={cardClasses + " flex flex-col items-center justify-center"}>
                  <p
                  className="text-xl font-medium tracking-wide text-center w-full">
                    {user.name} Projects
                  </p>

                  {
                    user.teams.map((team: Team) => 
                      <div
                      className="w-full rounded-md bg-neutral-900 flex flex-col gap-1 p-2"
                      key={team.team_id}>
                        <p className="text-lg font-medium tracking-wide"> {team.name} </p>
                        <p
                        className="flex gap-2 items-center text-sm">
                          <span
                          className="aspect-square w-1.5 rounded-full block"
                          style={{
                            backgroundColor: (
                              team.status === "Backlog" ? "gray" :
                              team.status === "Planning" ? "sky" :
                              team.status === "In Progress" ? "orange" :
                              team.status === "On Hold" ? "red" :
                              "violet"
                            )
                          }}>

                          </span>

                          {team.status}
                        </p>
                        <p
                        className="text-sm text-neutral-300">
                          {
                            team.description.length > 200 ?
                            team.description.slice(0, 200) + "..." :
                            team.description
                          }
                        </p>
                        
                        <div
                        className="w-full flex gap-2">
                          {
                            team.tags && team.tags.map((tag, index) =>
                              <span
                              className="px-3 py-1 rounded-full text-sm font-light border border-main/50 bg-main/20 text-text/80 w-max cursor-default"
                              key={index}>
                                {tag}
                              </span>
                            )
                          }
                        </div>
                      </div>
                    )
                  }
                </article>
              )
            }

          </section>
        </main>
      </div>
    ) : 
    notFound ? (
      <PageLayout>
        <main
        className="w-full min-h-200 relative flex flex-col items-center justify-center animate-fade-in-up">
          <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
            className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-100 md:h-230 bg-main/40 blur-3xl rounded-full animate-pulse" />
            <div className="bg-linear-to-t from-background to-transparent w-screen h-20 left-0 bottom-0 absolute z-3 pointer-events-none"></div>
            <div className="bg-linear-to-b from-background to-transparent w-screen h-20 left-0 top-0 absolute z-3 pointer-events-none"></div>
          </div>

          <p
          className="text-8xl text-center z-2 font-medium tracking-wide">
            404
          </p>
          <span
          className="text-xl z-2 opacity-70 font-light">
            Page not found
          </span>

          <Link
          href="/"
          className="mt-5 duration-400 hover:bg-neutral-100/20 z-2 py-2 px-6 rounded-xl">
            Go back to home
          </Link>
        </main>
      </PageLayout>
    ) : <LoadingScreen />
  )
}