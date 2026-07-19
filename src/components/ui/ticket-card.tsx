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
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Props {
  content: Ticket;
  userId: string;
  index: number;
  teamId: ParamValue;
  router: AppRouterInstance;
}

export default function TicketCard(props: Props) {
  const wrappedTitle : string = props.content.title.slice(0, 30) + "...";

  const importance = props.content.importance;
  const color: string = (importance === "Low" ? "blue" : importance === "Medium" ? "orange": "red" );

  return (
    <section
    className="rounded-md min-h-max md:h-65 xl:h-60 bg-neutral-950 border border-neutral-800 duration-400 hover:border-main hover:-translate-y-1 p-4 relative cursor-pointer flex flex-col"
    onClick={() => {
      props.router.push(`/projects/${props.teamId}/tickets/${props.index}`);
      return;
    }}>

      {/* Title */}
      <div
      className="w-full flex justify-between items-center">
        <p
        className="text-lg font-medium tracking-wide">
          {props.content.title.length > 30 ? wrappedTitle : props.content.title}
        </p>
      </div>

      <p>
        Asigned to <span className="text-sky-600"> {props.content.to} </span> <br />
        By <span className="text-sky-600"> {props.content.creator} </span>
      </p>
      
      <p
      className="text-neutral-400 mt-2 font-light mb-2">
        <span className="text-neutral-200"> Message: </span> <br />
        {props.content.message.trim().replace(/\r?\n/g, " ").replace(/\s+/g, " ").slice(0, 140) + (props.content.message.length > 140 ? "..." : "")}
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