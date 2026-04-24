// React imports
import { useRef, useState, useImperativeHandle, forwardRef } from "react";

// Props type
interface SnackbarProps {}

export interface SnackbarRef {
  showSnackBar: (message: string, isError?: boolean) => void;
}

const SnackBar = forwardRef<SnackbarRef, SnackbarProps>((_, ref) => {
  const snackbar = useRef<HTMLSpanElement>(null);

  const [sbmsg, setsbmsg] = useState("");
  const [sbie, setsbie] = useState(false);

  // Expose function outside component
  useImperativeHandle(ref, () => ({
    showSnackBar(message: string, isError = false) {
      if (!snackbar.current) return;

      const current = snackbar.current;

      // Set content
      setsbmsg(message);
      setsbie(isError);

      // Show snackbar
      current.classList.remove("hidden");

      // Hide after 3 sec
      setTimeout(() => {
        current.classList.add("hidden");
        setsbmsg("");
        setsbie(false);
      }, 3000);
    },
  }));

  return (
    <span
      ref={snackbar}
      className={`hidden fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-md text-white animate-fade-in-up z-99 ${
        sbie ? "bg-red-700" : "bg-green-700"
      }`}
    >
      {sbmsg}
    </span>
  );
});

export default SnackBar;