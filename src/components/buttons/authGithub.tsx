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
    className="bg-black rounded-xl w-full px-2 py-3 flex gap-3 justify-center items-center text-lg duration-300 cursor-pointer hover:scale-105 disabled:brightness-80 disabled:grayscale disabled:cursor-wait disabled:hover:scale-100 disabled:active:scale-100 active:duration-100 active:scale-95">
      <img
      src="/icons/github.svg"
      alt="Icon made by RavexCode"
      className="aspect-square w-6"/>
      Github
    </button>
  )
}