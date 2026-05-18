//Client page
"use client";

//React imports
import { useRef, useState } from "react";

//Next imports
import Link from "next/link";
import Image from "next/image";

//Prebuilt ui components
import AuthForm from "@/components/forms/authForm";
import { Input, PasswordInput } from "@/components/forms/inputs";
import ProviderButton from "@/components/forms/providerButton";
import Footer from "@/components/ui/footer";
import SnackBar, { SnackbarRef } from "@/components/ui/snackbar";

//Icons imports
import { IconArrowLeft } from "@tabler/icons-react";

//Hooks imports
import { useSaveToken } from "@/hooks/useCookies";

//User type
interface User {
  email: string,
  name: string,
  password: string,
  confirm: string,
}

export default function RegisterPage() {
  //Ref components
  const snackbar = useRef<SnackbarRef>(null);

  //States handler
  //Form avaible/unavaible
  const [ isFormDisponible, setIsFormDisponible ] = useState(true);
  //Emai
  const [ email, setEmail ] = useState<string>("");
  //Password
  const [ name, setName ] = useState<string>("");
  //Emai
  const [ password, setPassword ] = useState<string>("");
  //Password
  const [ confirm, setConfirm ] = useState<string>("");

  //Form submit handler
  const handleSubmit = async(e: any) => {
    //Prevents reloads
    e.preventDefault();
    //Turns off the form
    setIsFormDisponible(false);

    //Puts the data in the body
    const body : User = {
      //Puts the email in the body
      email,
      //Puts the email in the body
      name,
      //Puts the password in the body
      password,
      //Puts the password in the body
      confirm,
    };

    if(body.password !== body.confirm) {
      //If there's an error returns error
      snackbar.current?.showSnackBar("Passwords don't match", true);
      setIsFormDisponible(true);
    }

    //Makes the request
    const res = await fetch(
      //Route
      "/api/auth/register", {
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

    if(res.status === 201) {
      //Saves the cookie
      useSaveToken(resData.token);
      //Returns to dashboard
      window.location.href = "/oauth/success";
      return;
    }

    //If there's an error returns error
    snackbar.current?.showSnackBar(resData.message, true);
    setIsFormDisponible(true);
    return;
  };

  return (
    <div className="bg-background min-h-screen grid grid-rows-[1fr_auto]">
      <SnackBar
      ref={snackbar} />

      <main
      className="flex justify-start items-center w-full min-h-screen relative">

        <section
        className="bg-linear-to-t from-black to-neutral-900 w-full lg:w-max lg:min-w-150 p-10 h-full z-2 flex flex-col justify-center items-center relative">
          <Link
          href="/"
          className="absolute top-2 left-2 p-2 rounded-full duration-300 hover:bg-white/15">
            <IconArrowLeft
            size={25}
            stroke={2.5}
            color="whitesmoke" />
          </Link>

          <AuthForm
          onSubmit={(e: any) => { handleSubmit(e) }}
          title="Get started!"
          sumbitText="Sign up"
          disponible={isFormDisponible ? false : true}>

            <div
            className="flex flex-col gap-3 w-full justify-center items-center">
              <p>Sign up with</p>
              <ProviderButton
              provider="Github"
              toggled={isFormDisponible}
              toggler={setIsFormDisponible} />
              <ProviderButton
              provider="Google"
              toggled={isFormDisponible}
              toggler={setIsFormDisponible} />
              <ProviderButton
              provider="Gitlab"
              toggler={setIsFormDisponible}
              toggled={isFormDisponible} />
            </div>

            <div className="flex items-center w-full my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              
              <p className="px-4 text-center whitespace-nowrap">
                Or
              </p>
              
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
            guide="Jhon Doe"
            title="Insert your username"
            name="name"/>

            <span className="h-3"></span>

            <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            guide="me@email.com"
            title="Insert your email"
            name="email"/>

            <span className="h-3"></span>

            <PasswordInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            title="Insert your password"
            name="password"/>

            <span className="h-3"></span>

            <PasswordInput
            value={password}
            onChange={(e) => {
              setConfirm(e.target.value)
            }}
            title="Confirm your password"
            name="confirm"/>
          </AuthForm>

          <div
          className="w-100 max-w-[95dvw] text-text flex flex-col justify-center z-2 animate-fade-in-up text-center tracking-wide">
            <p>
              Don't have an account {" "}
               <Link
               href="/auth/login"
               className="text-sky-600 duration-200 hover:text-blue-400">
                Sign in
              </Link> 
            </p>

            <p>
              By logging in you agree to our {" "}
              <Link
              download={true}
              href="/legal/tos"
              className="text-sky-600 duration-200 hover:text-blue-400">
                Terms of service
              </Link>
            </p>
          </div>

        </section>

        <section
        className="relative w-full h-full overflow-hidden animate-fade-in hidden lg:flex items-start justify-center text-text text-center">
          <div
          className="w-[150%] aspect-square rounded-full absolute top-1/4 left-1/2 -translate-x-1/2 bg-blue-950/40 flex items-center justify-center blur-3xl animate-pulse">
            <div
            className="w-8/10 aspect-square rounded-full bg-blue-600/40 flex items-center justify-center">
              <div className="w-7/10 aspect-square rounded-full bg-blue-500/40"> </div>
            </div>
          </div>

          <div
          className="my-auto py-10 z-5">
            <Image
            src="/logos/large_white.svg"
            alt="Logo made by ravexcode"
            height={1}
            width={300}
            className="z-3" />

            <p
            className="text-lg font-medium tracking-wide mt-2">
              All your projects in a single App
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}