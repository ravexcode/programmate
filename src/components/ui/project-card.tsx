import {
  IconTrash,
  IconPencil,
  IconDotsVertical,
} from "@tabler/icons-react";
import { NextRouter } from "next/router";

//React imports
import { useState } from "react";

//Types
//Project card
interface ProjectCardProps {
  title: string;
  description: string;
  id: number;
  menuIndex: number | null;
  hideMenu: () => void;
  showMenu: () => void;
  index: number;
  status: string;
  tags: Array<string>;
  key: number;
  deleteProjectHandler: () => void;
  editProjectHandler: () => void;
  goToTeam: () => void
}

export default function ProjectCard(props : ProjectCardProps) {
  //Delete enabled/disabled state
  const [ isDeleteDisabled, setIsDeleteDisabled ] = useState<boolean>(false);

  return (
    <section
    onClick={() => {
      props.goToTeam()
    }}
    onContextMenu={(e) => {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      e.stopPropagation();
      props.showMenu();
    }}
    className="group relative w-full flex flex-col rounded-xl border border-neutral-800 bg-neutral-950 cursor-pointer duration-400 hover:-translate-y-1 hover:border-main p-5">

      <header
      className="flex items-start justify-between mb-3">

        <div
        className="w-full flex flex-col gap-1">
          <h3
          className="text-lg font-semibold text-text">
            {props.title}
          </h3>

          <p
          className="text-sm font-extralight flex justify-start items-center gap-2">
            <span
            className={"h-2 w-2 rounded-full block " + ( props.status === "Backlog" ? "bg-zinc-500" : props.status === "Planning" ? "bg-blue-400" : props.status === "In Progress" ? "bg-orange-400" : props.status === "On Hold" ? "bg-red-400" : "bg-purple-500" )}></span>
            {props.status}
          </p>
        </div>
        
        <button
        className="flex h-8 w-8 -mr-2 -mt-2 items-center justify-center rounded-full text-text hover:bg-ultramarine-50/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ultramarine-400 cursor-pointer"
        onClick={(e) => {
          e.nativeEvent.stopImmediatePropagation();
          e.stopPropagation();
          props.showMenu();
        }}>
        <IconDotsVertical
        size={16}
        color="white"
        stroke={3}/>
        </button>

        { props.menuIndex === props.index && (
          <div
          className="absolute right-2 top-10 z-20 w-36 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">

            <button
            onClick={(e) => {
              e.nativeEvent.stopImmediatePropagation(); 
              e.stopPropagation();
              props.editProjectHandler();
              props.hideMenu();
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
            setIsDeleteDisabled(true);
            await props.deleteProjectHandler();
            setIsDeleteDisabled(false);
            props.hideMenu();
          }}
          className="flex w-full items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-200 gap-2 disabled:brightness-80 disabled:cursor-wait"
          disabled={isDeleteDisabled}>

            <IconTrash
            size={20}
            stroke={1} />

            Delete
          </button>
          </div>
      )}

      </header>

      <p
      className="text-sm text-text/60 line-clamp-3 leading-relaxed">
        {props.description}
      </p>
      
      <div
      className="flex gap-2 mt-2 flex-wrap">
        {
          props.tags && props.tags.map((tag: string, index) => (
            <div
            className="px-3 py-1 rounded-full text-sm font-light border border-main/50 bg-main/20 text-text/80 w-max cursor-default"
            key={ index }>
              {tag}
            </div>
          ))
        }
      </div>
    </section>
  )
}