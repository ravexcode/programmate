//Client page
"use client";

//Prebuilt components
import SideBar from "@/components/ui/sidebar";

//React imports
import { useEffect, useState } from "react";
import { deleteCookie } from "cookies-next";
import AIChat from "@/components/ui/ai_chat";
import { getCookie } from "cookies-next/client";
import User from "@/modules/user.types";

//Config button
function ConfigButton({
  title,
  action
}: {
  title: string,
  action: () => void
}) {
  return (
    <button
    className="w-full md:w-9/20 py-3 rounded-lg flex justify-center items-center px-4 gap-5 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 duration-200 cursor-pointer text-center"
    onClick={action}>
      { title }
    </button>
  )
}

export default function ConfigurationPage(){
  //State handlers
  //User data
  const [ user, setUserData ] = useState<User>();
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

      return;
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
    className="grid grid-cols-[auto_1fr] bg-background relative animate-fade-in min-h-screen text-text">
      {/* Confirmation container */}
      <section
      className={`fixed inset-0 z-10 flex justify-center items-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in-up ${isConfirmationVisible ? "flex" : "hidden"}`}>
        <div
        className="w-md bg-neutral-900 p-5 rounded-md flex flex-col justify-center items-center">
          <span
          className="text-sm text-red-500 font-light mb-1">
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
            className="px-4 py-1 border border-neutral-700 rounded-md hover:border-neutral-500 duration-200 cursor-pointer">
              Cancel
            </button>
            <button
            onClick={() => {
              if(confirmationAction) confirmationAction();
            }}
            className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 duration-200 cursor-pointer disabled:brightness-80 disabled:cursor-wait  disabled:hover:brightness-80 disabled:grayscale"
            disabled={isLoading}>
              Confirm
            </button>
          </div>
        </div>
      </section>

      {/* Gradient section */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/10 blur-[100px] animate-pulse" />
      </div>

      <SideBar
      email={user?.email}
      plan={user?.plan}/>

      <AIChat />

      <section
      className="w-full flex flex-col justify-start items-center px-4 py-2 gap-2 z-3">
        <h2
        className="text-3xl font-semibold py-4 px-4 w-full text-start">
          Configuration
        </h2>

        <article
        className="w-full md:w-5/10 py-3 rounded-lg flex justify-start items-center px-4 gap-5 bg-neutral-900 border border-neutral-700">
          <img
          src="/icons/buttons/profile.svg"
          alt="Icon made by RavexCode"
          className="aspect-square block w-10 "/>

          <div className="flex flex-col justify-start items-start">
            <p
            className="text-xl font-semibold"> {user?.name} </p>
            <p
            className="text-sm font-light text-text/80"> {user?.email} </p>
          </div>

          <button
          className="ml-auto cursor-pointer duration-200 hover:brightness-60"
          onClick={() => {
            deleteCookie("token");
            window.location.href = "/auth/login"
          }}>
            <img
            src="/icons/buttons/logout.svg"
            alt="Icon made by RavexCode"
            className="aspect-square block w-8"/>
          </button>
        </article>

        <div className="flex items-center w-full md:w-4/10 my-4 opacity-60">
          <div className="flex-1 h-px bg-gray-300"></div>
          
          <p className="px-4 text-center whitespace-nowrap">
            User
          </p>
          
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <ConfigButton
        title="This button says Hello world"
        action={() => alert("Hello, world!")}/>

        <div className="flex items-center w-full md:w-4/10 my-4 opacity-60">
          <div className="flex-1 h-px bg-red-500"></div>
          
          <p className="px-4 text-center whitespace-nowrap text-red-500">
            Danger zone
          </p>
          
          <div className="flex-1 h-px bg-red-500"></div>
        </div>

        <ConfigButton
        title="Delete my account"
        action={() => { verifyConfirmation() }}/>
      </section>
    </div>
  )
}