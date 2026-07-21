//React imports
import { IconBrandGithubFilled, IconBrandGitlab, IconBrandGoogleFilled, IconZoomCancel } from "@tabler/icons-react";

export default function ProviderButton(props: {
  provider: string;
  toggler: React.Dispatch<React.SetStateAction<boolean>>;
  toggled: boolean;
}) {
  const goToProviderAuth = async() => {
    props.toggler(false);
    const res = await fetch(`/api/auth/${props.provider.toLowerCase()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      }
    });

    if(!res) {
      props.toggler(true);

    } else if(res.status !== 200) {

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
    disabled={props.toggled ? false : true}
    className="bg-neutral-900 flex gap-2 text-lg font-bold rounded-full justify-center items-center w-full py-2 cursor-pointer duration-500 hover:-translate-y-0.5 hover:bg-main shadow-md disabled:grayscale disabled:hover:bg-black disabled:cursor-wait disabled:hover:scale-100 disabled:brightness-80 disabled:duration-100">
      {
        props.provider === "Github" ? (
          <IconBrandGithubFilled
          size={20}/>
        ) : props.provider === "Google" ? (
          <IconBrandGoogleFilled
          size={20}/>
        ) : props.provider === "Gitlab" ? (
          <IconBrandGitlab
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