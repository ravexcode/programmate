//React imports
import { useState } from "react";

export default function AuthGoogleButton(){
  const [ isEnabled, setIsEnabled ] = useState(true);

  const goToGoogle = async() => {
    setIsEnabled(false);
    const res = await fetch("/api/auth/google", {
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
      goToGoogle();
    }}
    disabled={isEnabled ? false : true}
    className="bg-black flex gap-3 text-lg font-bold rounded-full border-2 border-ultramarine-50/20 justify-center items-center px-6 py-2 cursor-pointer duration-500 hover:scale-105 hover:bg-ultramarine-700 w-full shadow-md">
      <img
      src="/icons/google.svg"
      alt="Icon made by RavexCode"
      className="aspect-square w-6"/>
      Continue with Google
    </button>
  )
}