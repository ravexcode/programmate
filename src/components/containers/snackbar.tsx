import { RefObject } from "react";

//Props type
interface SnackbarProps {
  message?: string | null;
  isError?: boolean; // Error snackbar
  ref?: RefObject<null>
}

export default function SnackBar(props: SnackbarProps){
  return (
    <span
    className={"hidden fixed bottom-2 left-1/2 -translate-y-1/2 px-6 py-2 rounded-md animate-fade-in-up " + (!props.isError ? "bg-green-700" : "bg-red-700") }>
      { props.message }
    </span>
  )
}