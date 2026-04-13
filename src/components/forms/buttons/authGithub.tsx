//React imports
import { useState } from "react";

export default function AuthGithubButton(){
  const [ isEnabled, setIsEnabled ] = useState(true);

  const goToGithub = async() => {
    setIsEnabled(false);
    const res = await fetch("/api/auth/github", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
      }
    });

    if(!res) {
      setIsEnabled(true);
      console.error("An error has happened in the server");
    } else if(res.status !== 200) {
      const data = await res.json();
      console.error(`Message: ${data.message}\nError: ${data.error}`);
    } else {
      const data = await res.json();
      window.location.href = data.url;
    }
  }

  return(
    <button
    type="button"
    onClick={() => {
      goToGithub();
    }}
    disabled={isEnabled ? false : true}
    className="bg-black flex gap-3 text-lg font-bold rounded-md justify-center items-center px-6 py-2 cursor-pointer duration-500 hover:scale-105 hover:bg-ultramarine-700 w-full shadow-md
    disabled:grayscale disabled:hover:bg-black disabled:cursor-wait disabled:hover:scale-100 disabled:brightness-80 disabled:duration-100">
      <img
      src="/icons/github.svg"
      alt="Icon made by RavexCode"
      className="aspect-square w-6"/>
      Continue with Github
    </button>
  )
}