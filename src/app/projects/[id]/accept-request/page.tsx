//Client side
"use client";

//Prebuilt ui imports
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";

//Next imports
import Link from "next/link";
import { useGetToken, useDeleteToken } from "@/hooks/useCookies";
import { useParams } from "next/navigation";

//React imports
import { useState, useEffect, useRef } from "react";

//Services imports
import UpdateUserData from "@/services/user.service";
import { UserData } from "@/types/user.types";

export default function AcceptRequestPage(){
  const params = useParams();

  const [ isDisabled, setIsDisabled ] = useState<boolean>(true);
  const [ user, setUser ] = useState<UserData>();
  const [ authToken, setAuthToken ] = useState<string>("");

  const snackbar = useRef(null);

  useEffect(() => {
    async function getData(){
      const token = useGetToken();

      if(!token) return window.location.href = "/auth/signin";

      setAuthToken(token);
      const user_data = await UpdateUserData(token);
      
      if(!user_data){
        useDeleteToken();
        window.localStorage.clear();
        window.location.href = "/auth/signin";
      }

      setUser(user_data)
      setIsDisabled(false);
    }

    getData();
  }, []);

  const handleSaveInTheTeam = async() => {
    const res = await fetch(
      `/api/teams/${params.id}/integrants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "prismaflow-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          "Authorization": authToken
        },
        body: JSON.stringify({
          id: user?.id,
          email: user?.email,
          username: user?.name,
          type: "member",
          avatar_url: user?.avatar_url
        })
      }
    );

    const data = await res.json();

    if(res.status === 200) {
      window.location.href = `/teams/${params.id}`;
      return;
    }

    showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar);
    return;
  }

  return (
    <div
    className="min-h-screen grid grid-rows-[auto_1fr_auto] text-text">
      <SnackBar ref={snackbar} />
      <Header />

      <main
      className="w-full flex items-center justify-center py-20">
        <section
        className="bg-neutral-900 rounded-xl border border-neutral-700 px-5 py-3 text-lg font-medium tracking-wide text-center animate-fade-in-up w-max">
          Are You shure to that you wanna join to the team?

          <p
          className="mt-2  font-normal tracking-normal text-sm opacity-80">
            You can leave anytime what you want
          </p>

          <div
          className="text-sm p-3 mt-4 w-full grid grid-cols-2 gap-2 items-center justify-center font-normal">
            <Link
            href="/"
            className="w-full rounded-md duration-300 bg-neutral-800/80 hover:bg-neutral-700 p-2">
              Cancel
            </Link>
            
            <button
            className="w-full rounded-md bg-main cursor-pointer duration-300 hover:bg-main/80 disabled:hover:bg-main disabled:grayscale disabled:cursor-wait p-2"
            onClick={async() => {
              setIsDisabled(true);
              await handleSaveInTheTeam();
              setIsDisabled(false);
            }}
            disabled={isDisabled}>
              Accept
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}