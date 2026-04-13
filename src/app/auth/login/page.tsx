//Client page
"use client";

//React imports
import { useRef, useState } from "react";

//Next imports
import { setCookie } from "cookies-next";

//Form components
import AuthForm from "@/components/forms/authForm";
import { Input, PasswordInput } from "@/components/forms/inputs";

//Auth buttons
import AuthGoogleButton from "@/components/forms/buttons/authGoogle";
import AuthGithubButton from "@/components/forms/buttons/authGithub";

//UI Components
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function LogInPage() {
  const form = useRef(null);
  const [ isFormDisponible, setIsFormDisponible ] = useState(true);
  const [ formMessage, setFormMessage ] = useState("");

  //Form submit handler
  const handleSubmit = async(e: any) => {
    //Prevents reloads
    e.preventDefault();
    //Turns off the form
    setIsFormDisponible(false);

    //Verifies if form ref exists
    if(!form.current) {
      //Turns on
      setIsFormDisponible(true);
      return;
    }

    //Gets the form data
    const current : any = form.current!;
    const data = current.querySelectorAll("input");
    //Puts the data in the body
    const body : Object = {
      //Puts the email in the body
      email: data[0].value,
      //Puts the password in the body
      password: data[1].value,
    };

    //Makes the request
    const res = await fetch(
      //Route
      "/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //Api key
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        //Log in data
        body: JSON.stringify(body),
      }
    );

    //Process the data
    const resData = await res.json();

    if(res.status === 200) {
      //Saves the cookie
      setCookie("token", resData.token);
      //Returns to dashboard
      window.location.href = "/dashboard";
      return;
    }

    //If there's an error returns error
    setFormMessage(resData.message);
    setIsFormDisponible(true);
    return;
  };

  return (
    <div className="bg-background min-h-dvh grid grid-rows-[auto_1fr_auto]">
        <main
        className="flex flex-col justify-center items-center w-full h-full py-20 relative">

          <AuthForm
          onSubmit={(e: any) => { handleSubmit(e) }}
          title="Welcome back!"
          sumbitText="Sign in"
          disponible={isFormDisponible ? false : true}
          ref={form}
          message={formMessage}>
            <div
            className="flex flex-col gap-3 w-full justify-center items-center">
              <p>Sign in with</p>
              <AuthGoogleButton />
              <AuthGithubButton />
            </div>

            <div className="flex items-center w-full my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              
              <p className="px-4 text-center whitespace-nowrap">
                Or
              </p>
              
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <Input
            type="email"
            guide="me@email.com"
            title="Insert your email"
            name="email"/>
            <span className="h-3"></span>
            <PasswordInput
            title="Insert your password"
            name="password"/>
          </AuthForm>

          <div
          className="w-100 max-w-[95dvw] text-text flex flex-col justify-center z-2 animate-fade-in-up text-center">
            <p> Don't have an account? <a href="/auth/register" className="text-blue-500 duration-200 hover:underline hover:text-blue-400">Sign up</a> </p>
            <p> By logging in you agree to our <a download={true} href="/legal/terms-and-service" className="text-blue-500 duration-200 hover:underline hover:text-blue-400">terms of service</a> </p>
          </div>

          <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
            className="absolute aspect-square block left-1/2 top-1/1 -translate-x-1/2 -translate-y-1/2 h-300 bg-main/20 blur-3xl rounded-full animate-pulse" />
          </div>
        </main>
      <Footer />
    </div>
  )
}