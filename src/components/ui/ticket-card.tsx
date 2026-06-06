//Next imports
import { ParamValue } from "next/dist/server/request/params";

//Icons imports
import {
  IconCircleFilled,
  IconDotsVertical,
  IconPencil,
  IconTrash
} from "@tabler/icons-react";

//Types setup
//Imports
import type { Ticket } from "@/types/team.types";
import type { Dispatch, SetStateAction } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Props {
  content: Ticket;
  teamId: ParamValue;
  index: number;
  setMenuIndex: Dispatch<SetStateAction<number | undefined>>;
  menuIndex: number | undefined;
  router: AppRouterInstance;
  editAction: () => void;
  deleteAction: () => void;
}

export default function TicketCard(props: Props) {
  const wrappedTitle : string = props.content.title.slice(0, 30) + "...";

  const importance = props.content.importance;
  const title = props.content.title;
  const color: string = (importance === "Low" ? "blue" : importance === "Medium" ? "orange": "red" );

  return (
    <section
    className="rounded-md h-max md:h-65 xl:h-60 bg-neutral-950 border border-neutral-800 duration-400 hover:border-main hover:-translate-y-1 p-4 relative cursor-pointer flex flex-col"
    onClick={() => {
      props.router.push(`/teams/${props.teamId}/tickets/${props.index}`);
      return;
    }}>
      {/* Edit / Delete menu */}
      { props.menuIndex === props.index && (
        <div
        className="absolute right-2 top-10 z-20 w-36 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">

          <button
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation(); 
            e.stopPropagation();
            props.editAction();
          }}
          className="flex w-full items-center px-4 py-2.5 text-sm text-text hover:bg-neutral-800 gap-2">

            <IconPencil
            size={20}
            color="white" />

            Edit
          </button>
          
          <button
          onClick={async (e) => {
            e.nativeEvent.stopImmediatePropagation(); 
            e.stopPropagation();
            props.deleteAction();
          }}
          className="flex w-full items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-200 gap-2 disabled:brightness-80 disabled:cursor-wait">

            <IconTrash
            size={20}
            stroke={1} />

            Delete
          </button>
        </div>
      )}

      {/* Title and menu toggler */}
      <div
      className="w-full flex justify-between items-center">
        <p
        className="text-lg font-medium tracking-wide">
          {props.content.title.length > 30 ? wrappedTitle : props.content.title}
        </p>
        <button
        type="button"
        className="p-2 rounded-full hover:bg-neutral-800 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopPropagation();
          props.setMenuIndex(prev => prev === props.index ? undefined : props.index);
        }}>
          <IconDotsVertical
          size={20} />
        </button>
      </div>

      <p>
        Asigned to <span className="text-sky-600"> {props.content.to} </span> <br />
        By <span className="text-sky-600"> {props.content.creator} </span>
      </p>
      
      <p
      className="text-neutral-400 mt-2 font-light mb-2">
        <span className="text-neutral-200"> Message: </span> <br />
        {props.content.message.trim().replace(/\r?\n/g, " ").replace(/\s+/g, " ").slice(0, 100) + (props.content.message.length > 100 ? "..." : "")}
      </p>

      <section
      className="w-full rounded-md py-2 px-4 text-sm bg-neutral-900 mt-auto flex gap-2 items-center">
        <IconCircleFilled
        size={10}
        color={color} />
        <p> Importance: { importance.toLowerCase() } </p>
      </section>
    </section>
  )
}