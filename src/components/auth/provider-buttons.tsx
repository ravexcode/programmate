//React imports
import { IconBrandGithubFilled, IconBrandGitlab, IconBrandGoogleFilled, IconZoomCancel } from "@tabler/icons-react";
import { oauthRedirectRequest } from "@/client/auth";

export default function ProviderButton(props: {
  provider: string;
  toggler: React.Dispatch<React.SetStateAction<boolean>>;
  toggled: boolean;
}) {
  const goToProviderAuth = async() => {
    props.toggler(false);
    const res = await oauthRedirectRequest(props.provider);

    if(res.status !== 200) {
      props.toggler(true);
      return;
    }

    const data = res.data;
    window.location.href = data.url;
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