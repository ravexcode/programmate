import { IconRocket } from "@tabler/icons-react";

export default function InConstruction() {
  return (
    <div
    className="bg-gray-950 text-text flex flex-col justify-center items-center h-screen w-screen">
      <IconRocket
      size={100}
      stroke={0.6} />

      <p
      className="text-xl tracking-wide text-center font-medium">
        We're sorry <br />
        <span
        className="text-lg font-light">
          This page is currently in construction
        </span>
      </p>

      <a
      href="/"
      className="tracking-wide bg-main px-6 py-2 mt-5 text-sm rounded-md hover:bg-main/60">
        Go to the main page
      </a>
    </div>
  );
}