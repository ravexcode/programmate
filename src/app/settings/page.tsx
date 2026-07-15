//Client page
"use client";

//Next imports
import Image from "next/image";
import { useRouter } from "next/navigation";

//Prebuilt components
import SideBar from "@/components/ui/sidebar";
import ActionButton from "@/components/ui/action-button";
import LoadingDashboard from "@/components/screens/loading-screen";
import SnackBar from "@/components/ui/snackbar";
import SmoothProvider from "@/lib/components/lennis";

//Hooks imports
import useAnimationClose from "@/hooks/useAnimationClose";

//React imports
import { useEffect, useRef, useState } from "react";

//Types imports
import { UserData } from "@/types/user.types";

//Icons imports
import {
  IconBug,
  IconLogout,
  IconMail,
  IconPencil,
  IconSparkles,
  IconTrash,
  IconUserCircle,
  IconUserCog,
  IconZoomMoney
} from "@tabler/icons-react";

//Services imports
import {
  logOut
} from "@/services/session.service";

//Modules imports
import {
  getUser,
  updateUser
} from "@/modules/user.module";

export default function ConfigurationPage(){
  //Next setup
  const router = useRouter();

  //State handlers
  //User data
  const [ user, setUserData ] = useState<UserData>();
  //Is loading state
  const [ loading, setLoading ] = useState<boolean>(false);

  //Confirmation card
  const confirmationCard = useRef(null);
  //Snackbar card
  const snackbar = useRef(null);

  //Gets the user data from cache
  useEffect(() => {
    async function get() {
      const data = await getUser(router);

      setUserData(data!);
    }

    get();
  }, []);

  const toggleConfirmation = () => {
    if(!confirmationCard.current) return;

    const current : HTMLElement = confirmationCard.current;
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
    <div
    className="grid grid-cols-[auto_1fr] bg-background relative animate-fade-in h-screen text-text overflow-hidden">
      <SnackBar ref={snackbar} />
      <SideBar
      email={user?.email!}
      plan={user?.plan!}
      avatar={user?.avatar_url}
      username={user?.name!}/>

      <div
      className="w-screen h-screen z-10 backdrop-blur backdrop-brightness-75 items-center justify-center fixed animate-fade-in-up hidden">
        
      </div>

      {
        user ? (
          <main
          className="w-full flex flex-col justify-start items-center px-4 pt-2 pb-10 gap-2 z-3 relative min-h-screen overflow-auto">
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <div className="absolute left-1/2 top-1/2 aspect-square block w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/15 blur-3xl animate-pulse" />
            </div>

            <section
            className="w-full max-w-4xl flex flex-col gap-6 z-2 items-center justify-center">
              <article className="bg-[#101010] text-white p-5 flex flex-col w-full rounded-xl items-center h-max mt-16">
                <div className="-mt-16 mb-4 bg-[#101010] rounded-full w-32 aspect-square p-3 relative">
                  {
                    user.avatar_url ? (
                      <Image
                        src={user.avatar_url!}
                        alt={`${user.email} profile picture`}
                        width={500}
                        height={500}
                        className="object-cover rounded-full aspect-square w-26 block"
                        preload
                        loading="eager"
                      />
                    ) : (
                      <div
                      className="w-26 aspect-square flex items-center justify-center rounded-full bg-linear-30 from-blue-950/50 to-blue-700 text-6xl font-bold">
                        { user.name.slice(0, 1) }
                      </div>
                    )
                  }
                  <div
                  className="flex items-center justify-center absolute aspect-square w-26 rounded-full bg-black/50 backdrop-blur z-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 duration-300 cursor-pointer">
                    <IconPencil
                    size={50}
                    stroke={1.5} />
                  </div>
                </div>

                <p className="text-2xl font-medium tracking-wide">
                  {user?.name}
                </p>
                
                <p className="font-light tracking-wide opacity-60">
                  {user?.email}
                </p>
                
              </article>

              <div
              className="w-full flex justify-between items-center py-3 opacity-70 cursor-default">
                <div className="w-full bg-zinc-50 h-px rounded-full"></div>
                <p
                className="w-80 text-center">
                  Account settings
                </p>
                <div className="w-full bg-zinc-50 h-px rounded-full"></div>
              </div>

              
              <ActionButton
              title="Change username"
              action={() => {
                
              }}>
                <IconUserCog />
              </ActionButton>

              <ActionButton
              title="Log out"
              action={() => {
                logOut(router);
              }}>
                <IconLogout />
              </ActionButton>

              
              <div
              className="w-full flex justify-between items-center py-3 opacity-70 cursor-default">
                <div className="w-full bg-zinc-50 h-px rounded-full"></div>
                <p
                className="w-80 text-center">
                  Support
                </p>
                <div className="w-full bg-zinc-50 h-px rounded-full"></div>
              </div>

              <ActionButton
              title="Report a bug"
              action={() => {  }}>
                <IconBug />
              </ActionButton>

              
              <ActionButton
              title="Make a suggestion"
              action={() => {  }}>
                <IconSparkles />
              </ActionButton>

              
              <ActionButton
              title="Contact us"
              action={() => {  }}>
                <IconMail />
              </ActionButton>

              <ActionButton
              title="View my subscription payments"
              action={() => {  }}>
                <IconZoomMoney />
              </ActionButton>

              <div
              className="w-full flex justify-between items-center py-3 cursor-default text-red-500">
                <div className="w-full bg-red-500 h-px rounded-full"></div>
                <p
                className="w-80 text-center">
                  Danger zone
                </p>
                <div className="w-full bg-red-500 h-px rounded-full"></div>
              </div>

              <ActionButton
              title="Delete account"
              action={toggleConfirmation}
              isDangerous>
                <IconTrash />
              </ActionButton>

            </section>

            
          </main>
        ) : (
          <LoadingDashboard />
        )
      }
    </div>
  )
}