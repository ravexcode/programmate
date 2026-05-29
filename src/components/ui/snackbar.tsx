export default function SnackBar({ ref } : { ref :React.RefObject<null> }) {
  return (
    <div
    className="fixed bottom-4 left-1/2 -translate-x-1/2 animate-fade-in-up z-100 text-white p-2 px-4 rounded-md font-medium w-max max-w-w-60 text-center hidden"
    ref={ref}>
      {/* There will be the snackbar content */}
    </div>
  )
}

export function showSnackbar(
  message: string,
  type: "valid" | "warn" | "critic",
  snackbar: React.RefObject<null>
) {
  if(!snackbar.current) return;

  const current : HTMLElement = snackbar.current;

  const bg_color =
  type === "valid" ? "bg-green-600" :
  type === "warn" ? "bg-orange-600" :
  "bg-red-600";

  current.innerText = message;

  current.classList.add(bg_color);

  current.classList.replace("hidden", "block");

  const interval = setInterval(hideSnackbar, 2000);

  function hideSnackbar() {
    current.classList.remove(bg_color);
    current.classList.replace("block", "hidden");
    current.innerText = "";
    clearInterval(interval)
  }
}