//React imports
import { IconBrandGithub, IconBrandGithubFilled, IconBrandGoogleFilled, IconMoodSad, IconZoomCancel } from "@tabler/icons-react";
import { useState } from "react";

export default function ProviderButton(props: { provider: string }) {
  const [ isEnabled, setIsEnabled ] = useState(true);

  const goToProviderAuth = async() => {
    setIsEnabled(false);
    const res = await fetch(`/api/auth/${props.provider.toLowerCase()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      }
    });

    if(!res) {
      setIsEnabled(true);

    } else if(res.status !== 200) {

      const data = await res.json();

    } else {

      const data = await res.json();
      window.location.href = data.url;
    }
  }

  return (
    <button
    type="button"
    onClick={() => {
      goToProviderAuth();
    }}
    disabled={isEnabled ? false : true}
    className="bg-neutral-900 flex gap-2 text-lg font-bold rounded-full justify-center items-center w-full py-2 cursor-pointer duration-500 hover:-translate-y-0.5 hover:bg-main shadow-md disabled:grayscale disabled:hover:bg-black disabled:cursor-wait disabled:hover:scale-100 disabled:brightness-80 disabled:duration-100">
      {
        props.provider === "Github" ? (
          <IconBrandGithubFilled
          size={20}/>
        ) : props.provider === "Google" ? (
          <IconBrandGoogleFilled
          size={20}/>
        ) : (
          <IconZoomCancel
          size={20}/>
        )
      }

      <p
      className="font-medium tracking-wide">
        { props.provider }
      </p>
    </button>
  )
}