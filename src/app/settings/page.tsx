//Client page
"use client";

//Next imports
import Image from "next/image";
import { useRouter } from "next/navigation";

//Prebuilt components
import SideBar from "@/components/ui/sidebar";
import ActionButton from "@/components/ui/action-button";
import LoadingDashboard from "@/components/screens/loading-screen";
import AltButton from "@/components/ui/buttons/alternate";
import HazardButton from "@/components/ui/buttons/hazard";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";

//Hooks imports
import { useDeleteToken, useGetToken } from "@/hooks/useCookies";
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
  IconSparkles,
  IconTrash,
  IconUserCircle,
  IconZoomMoney
} from "@tabler/icons-react";

export default function ConfigurationPage(){
  //Next setup
  const router = useRouter();

  //State handlers
  //User data
  const [ user, setUserData ] = useState<UserData>();
  //Is loading state
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  //Confirmation card
  const confirmationCard = useRef(null);
  //Snackbar card
  const snackbar = useRef(null);

  //Gets the user data from cache
  useEffect(() => {
    //Cached user
    const user_cached = localStorage.getItem("user");

    //Verifies if is cached
    if(user_cached) {
      //Sets the user data
      setUserData(JSON.parse(user_cached))
    } else {
      //If isn't cached redirects to dashboard
      window.location.href = "/dashboard";
    }
  }, []);

  //User delete handler
  const handleUserDelete = async () => {
    setIsLoading(true);
    //User token
    const token = useGetToken();

    try {
      //Sends the delete request to the server
      const res = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          "Authorization": token!,
        }
      });

      const data = await res.json();

      //Verifies the response
      if(res.status === 200) {
        //Deletes the user from cache
        window.localStorage.clear();
        useDeleteToken();
        //Redirects to the login page
        router.push("/auth/login");
        return;
      }

      setIsLoading(false);
      showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar);
    } catch(e) {
      //Error handler
      if(e instanceof Error) {
        setIsLoading(false);
        return showSnackbar(e.message, "critic", snackbar);
      }
      
      setIsLoading(false);
      return showSnackbar("Server not error", "critic", snackbar);
    }
  };

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
      {/* Confirmation container */}
      <section
      className="fixed inset-0 z-10 hidden justify-center items-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in-up"
      ref={confirmationCard}
      onClick={toggleConfirmation}>
        <div
        className="w-md bg-neutral-900 border border-red-950 p-5 rounded-md flex flex-col justify-center items-center"
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopPropagation();
        }}>
          <span
          className="font-xl text-red-500 mb-1">
            Alert
          </span>

          <h2
          className="text-lg mb-4 text-center px-2">
            Are you shure to delete your account?
            <p
            className="text-red-500 text-sm mt-2 w-full rounded-sm">
              This action can't be undone.
            </p>
          </h2>

          <div
          className="grid grid-cols-2 gap-3 w-full px-2 py-1">
            <AltButton
            size="w-auto"
            action={toggleConfirmation}>
              Cancel
            </AltButton>
            <HazardButton
            size="w-auto"
            isLoading={isLoading}
            action={async() => {
              await handleUserDelete();
            }}>
              Confirm
            </HazardButton>
          </div>
        </div>
      </section>

      <SnackBar ref={snackbar} />
      <SideBar
      email={user?.email!}
      plan={user?.plan!}
      avatar={user?.avatar_url}
      username={user?.name!}/>

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
                <div className="-mt-16 mb-4 bg-[#101010] rounded-full w-32 aspect-square p-3">
                  {
                    user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={`${user.email} profile picture`}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover rounded-full" 
                        preload
                        loading="eager"
                      />
                    ) : (
                      <IconUserCircle
                      size={100}
                      stroke={1}
                      className="aspect-square object-cover w-full h-full" />
                    )
                  }
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
                  User settings
                </p>
                <div className="w-full bg-zinc-50 h-px rounded-full"></div>
              </div>

              
              <ActionButton
              title="Log out"
              action={() => {
                useDeleteToken();
                window.localStorage.clear();
                router.push("/auth/login");
              }}>
                <IconLogout
                stroke={1.5} />
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
                <IconBug
                stroke={1.5} />
              </ActionButton>

              
              <ActionButton
              title="Make a suggestion"
              action={() => {  }}>
                <IconSparkles
                stroke={1.5} />
              </ActionButton>

              
              <ActionButton
              title="Contact us"
              action={() => {  }}>
                <IconMail
                stroke={1.5} />
              </ActionButton>

              <ActionButton
              title="View my subscription payments"
              action={() => {  }}>
                <IconZoomMoney
                stroke={1.5} />
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
                <IconTrash
                stroke={1.5} />
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