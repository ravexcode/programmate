//Client page
"use client";

//Next imports
import Image from "next/image";

//Prebuilt components
import SideBar from "@/components/ui/sidebar";

//React imports
import { useEffect, useState } from "react";
import { deleteCookie } from "cookies-next";
import AIChat from "@/components/ui/ai-chat";
import { getCookie } from "cookies-next/client";
import { UserData } from "@/types/user.types";
import { IconBug, IconLogout, IconMail, IconSparkles, IconTrash, IconZoomMoney } from "@tabler/icons-react";
import LoadingDashboard from "@/components/screens/loading-screen";

//Config button
function ActionButton({
  title,
  action,
  children,
  isDangerous
}: {
  title: string;
  action: () => void;
  children?: React.ReactNode;
  isDangerous?: boolean;
}) {
  return (
    <button
    className={"py-4 rounded-lg flex justify-between items-center px-8 gap-5 border  duration-200  hover:-translate-y-1 w-full outline-none bg-[#101010] cursor-pointer text-center " + (isDangerous ? "border-red-900/40 hover:border-red-700" : "border-neutral-900 hover:border-main")}
    onClick={action}>
      <p
      className="text-lg tracking-wide">
        { title }
      </p>
      { children }
    </button>
  )
}

export default function ConfigurationPage(){
  //State handlers
  //User data
  const [ user, setUserData ] = useState<UserData>();
  //Is confirmation section visible
  const [ isConfirmationVisible, setIsConfirmationVisible ] = useState<boolean>(false);
  //Confirmation text
  const [ confirmationText, setConfirmationText ] = useState<string>("");
  //Confirmation action
  const [ confirmationAction, setConfirmationAction ] = useState<() => void>();
  //Is loading state
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

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
    const token = getCookie("token");

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

      //Verifies the response
      if(res.status === 200) {
        //Deletes the user from cache
        window.localStorage.clear();
        deleteCookie("token");
        //Redirects to the login page
        window.location.href = "/auth/login";
        return;
      }
      
      const error = await res.json();
      setIsLoading(false);
      throw new Error(error.message || "Error deleting the user");
    } catch(e) {
      //Error handler
      console.error(e);
      setIsLoading(false);
    }
  };

  //Verify confirmation
  const verifyConfirmation = () => {
    //Show the confirmation section
    setIsConfirmationVisible(true);
    //Sets the confirmation text
    setConfirmationText("Are you sure you want to delete your account? This action can't be undone.");
    //Sets the function
    setConfirmationAction(() => handleUserDelete);
  }

  //Confirmation section handler
  const cancelConfirmation = () => {
    //Hides the confirmation section
    setIsConfirmationVisible(false);
    //Clears the confirmation text
    setConfirmationText("");
    //Clears the confirmation action
    setConfirmationAction(undefined);
  }
  return (
    <div
    className="grid grid-cols-[auto_1fr] bg-background relative animate-fade-in h-screen text-text overflow-hidden">
      {/* Confirmation container */}
      <section
      className={`fixed inset-0 z-10 flex justify-center items-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in-up ${isConfirmationVisible ? "flex" : "hidden"}`}>
        <div
        className="w-md bg-neutral-900 border border-red-950 p-5 rounded-md flex flex-col justify-center items-center">
          <span
          className="font-xl text-red-500 mb-1">
            Alert
          </span>

          <h2
          className="text-lg mb-4 text-center px-2">
            {confirmationText}
          </h2>

          <div
          className="grid grid-cols-[47%_47%] gap-1 w-full px-2 py-1">
            <button
            onClick={() => {
              cancelConfirmation();
            }}
            className="px-4 py-1 rounded-md hover:bg-neutral-700 duration-200 cursor-pointer">
              Cancel
            </button>
            <button
            onClick={() => {
              if(confirmationAction) confirmationAction();
            }}
            className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-900 duration-200 cursor-pointer disabled:brightness-80 disabled:cursor-wait  disabled:hover:brightness-80 disabled:grayscale"
            disabled={isLoading}>
              Confirm
            </button>
          </div>
        </div>
      </section>

      <SideBar
      email={user?.email!}
      plan={user?.plan!}
      avatar={user?.avatar_url}
      username={user?.name!}/>

      <AIChat />

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
                  <Image
                    src={user?.avatar_url!}
                    alt={`${user?.email} profile picture`}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover rounded-full" 
                    preload
                    loading="eager"
                  />
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
                deleteCookie("token");
                window.localStorage.clear();
                window.location.href = "/auth/login";
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
              action={() => {
                verifyConfirmation();
              }}
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