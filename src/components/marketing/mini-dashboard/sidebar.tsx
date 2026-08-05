//Types setup
import type { Views } from "./main";
interface Props {
  setCurrentView: React.Dispatch<React.SetStateAction<Views>>;
}

//Next imports
import Image from "next/image";

//Button comp
function Button(props: {
  action: () => void;
  icon: React.ReactNode;
  content: string
}) {
  return (
    <button
    type="button"
    className="flex gap-1 w-full items-center justify-start p-2 text-sm duration-300 hover:bg-main/60 rounded-md cursor-pointer"
    onClick={props.action}>
      { props.icon }
      <span
      className="hidden sm:inline">
        { props.content }
      </span>
    </button>
  )
}

//Icons imports
import {
  IconChecklist,
  IconLayoutDashboard,
  IconLayoutSidebar,
  IconSparkles
} from "@tabler/icons-react";

export default function MiniDashboardSidebar(props: Props) {
  return (
    <aside
    className="flex flex-col gap-2 items-center justify-start bg-neutral-950 w-16 sm:w-70 py-3 px-2">
      <Image
      src="/logos/large.svg"
      alt="NexZero logo"
      width={40}
      height={40}
      className="h-4 mb-2" />
      <div
      className="flex gap-1 w-full items-center justify-start p-2 text-xs duration-300 hover:bg-main/60 rounded-md cursor-pointer">
        <IconLayoutSidebar size={18} />
        <span
        className="hidden sm:inline">
          Close
        </span>
      </div>
      <Button
      content="Dashboard"
      action={() => props.setCurrentView("dashboard")}
      icon={<IconLayoutDashboard size={18} />} />

      <span
      className="px-2 font-medium tracking-wide w-full text-start">
        User
      </span>

      <Button
      content="To Do"
      action={() => props.setCurrentView("todo")}
      icon={<IconChecklist size={18} />} />
      <Button
      content="NexZero AI"
      action={() => props.setCurrentView("ai")}
      icon={<IconSparkles size={18} />} />

      <div
      className="mt-auto flex gap-2 w-full items-center justify-start p-2 text-xs duration-300 hover:bg-main/60 rounded-md cursor-pointer">
        <Image
        src="/logos/logo.svg"
        alt="NexZero logo"
        width={24}
        height={24}
        className="aspect-square rounded-full w-6" />

        <p
        className="hidden sm:block text-xs">
          NexZero <br />
          <span
          className="text-[10px] opacity-70">
            example@nexzero.app
          </span>
        </p>
      </div>
    </aside>
  )
}