//Client side
"use client";

//Next imports
import { useRouter } from "next/navigation";

//React imports
import { useEffect, useState, useRef } from "react";

//Hooks imports
import { getCached } from "@/hooks/cache.hook";
import { useGetToken } from "@/hooks/useCookies";

//Components imports
import SideBar, { Icon } from "@/components/ui/sidebar";
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";
import AIChat from "@/components/ui/ai-chat";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";

//Types imports
import type { UserData, ToDoList } from "@/types/user.types";
import type Team from "@/types/team.types";

//Services imports
import UpdateUserData from "@/services/user.service";
import LoadingDashboard from "@/components/screens/loading-screen";

//Icons imports
import {
  IconDotsVertical,
  IconPencil,
  IconPlus,
  IconReload,
  IconTrash
} from "@tabler/icons-react";

export default function ToDoListPage() {
  //Router settings
  const router = useRouter();

  //States handler
  //User data
  const [user, setUser] = useState<UserData | null>(null);
  //Is reloading button
  const [ isReloading, setIsReloading ] = useState<boolean>(false);
  //Creator form states
  const [ newListName, setNewListName ] = useState<string>("");
  const [ newListDescription, setNewListDescription ] = useState<string>("");
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  //List options state
  const [ openMenuIndex, setOpenMenuIndex ] = useState<number | null>(null);
  //Sidebar expanded
  const [ expanded, setExpanded ] = useState<boolean>(false);

  //Tags
  const [ currentTag, setCurrentTag ] = useState<string>("");
  const [ tags, setTags ] = useState<string []>([]);

  //List editor content
  const [ previousList, setPreviousList ] = useState<ToDoList | null>(null);
  const [ listName, setListName ] = useState<string>("");
  const [ listDescription, setlistDescription ] = useState<string>("");
  const [ listCurrentTag, setListCurrentTag ] = useState<string>("");
  const [ listTags, setListTags ] = useState<string []>([]);
  const [ listIndex, setListIndex ] = useState<number>();
  const [ editorIsLoading, setEditorIsLoading ] = useState<boolean>(false);

  //Components refs
  const form_creator = useRef<HTMLDivElement>(null);
  const form_editor = useRef<HTMLDivElement>(null);
  //Snackbar
  const snackbar = useRef(null);

  //Function for hide the menu of to do list when user clicks outside
  useEffect(() => {
    //Function for close menu
    const closeMenu = () => {
      //Menu index
      setOpenMenuIndex(null);
      return;
    }
    
    //Event that listens the click
    document.addEventListener("click", closeMenu);
    
    //Remove the event listener
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  //Data fetching form cache
  useEffect(() => {
    //Gets the cached user
    const user = getCached();

    //If there is a cached user, sets the user data
    if(user) {
      setUser(user);
    }
  }, []);

  //Function to handle project creation
  const handleCreateToDoList = async(e: React.SubmitEvent) => {
    //Prevents default
    e.preventDefault();
    //Set button to loading
    setIsLoading(true);
    
    //Sets the list data
    const new_list = {
      list_title: newListName,
      list_description: newListDescription
    };

    //Gets the token
    const token = useGetToken();

    if(!token) return window.location.href = "/auth/login";

    //Creates the new list
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        "Authorization": token,
      },
      body: JSON.stringify(new_list)
    });

    //Gets data from response
    const data = await res.json();

    if(res.status === 200) {
      //Updates the user data
      setUser(prev => prev ? {
        ...prev,
        to_do_list: [
          ...(prev.to_do_list ?? []),
          {
            title: new_list.list_title,
            description: new_list.list_description
          }
        ]
      } : prev);

      //Hides the form
      toggleListCreator();
      //Change loading state
      setIsLoading(false);
      //Clear all the inputs
      setNewListName("");
      setNewListDescription("");
      setCurrentTag("");
      setTags([]);
      //Returns success
      return;
    }
    
    //Verifies if there's an error
    if(data.error) {
      showSnackbar(data.message, "critic", snackbar);
    }
    //Cancels loading status
    setIsLoading(false);
  };
  
  const toggleListCreator = () => {
    if(!form_creator.current) return;

    const current: HTMLElement = form_creator.current;

    //Show
    if(current.classList.contains("hidden")){
      form_creator.current.classList.remove("hidden");
      form_creator.current.classList.add("flex");
    } else {
      //Hide
      form_creator.current.classList.add("hidden");
      form_creator.current.classList.remove("flex");
    }
  }
  
  const toggleListEditor = () => {
    if(!form_editor.current) return;

    const current: HTMLElement = form_editor.current;

    //Show
    if(current.classList.contains("hidden")){
      form_editor.current.classList.remove("hidden");
      form_editor.current.classList.add("flex");
    } else {
      //Hide
      form_editor.current.classList.add("hidden");
      form_editor.current.classList.remove("flex");
    }
  }

  const setListEditorData = (index: number) => {
    if(!user || !user.to_do_list || index > user.to_do_list.length - 1 || index < 0) return;

    const current_list = user.to_do_list[index];

    setPreviousList(current_list);
    setListIndex(index);

    setListName(current_list.title);
    setlistDescription(current_list.description);
    setListTags(current_list.tags || []);

    toggleListEditor();

    return;
  }

  const handleEditToDoList = async(e: React.SubmitEvent) => {
    //Prevents default
    e.preventDefault();
    //Set button to loading
    setEditorIsLoading(true);


    //Gets the token
    const token = useGetToken();

    if(!token) return window.location.href = "/auth/login";

    const content = {
      title: listName,
      description: listDescription,
      tags: listTags
    }

    //Creates the new list
    const res = await fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        "Authorization": token,
      },
      body: JSON.stringify({
        list_index: listIndex,
        content: content
      })
    });

    //Gets data from response
    const data = await res.json();

    if(res.status === 200) {
      //Updates the user data
      setUser(prev => prev ? {
      ...prev,
      to_do_list: prev.to_do_list?.map((list, i) => {
        if (i !== listIndex) return list;

        return {
          title: listName,
          description: listDescription,
          tags: listTags
        };
      }) ?? []
    } : prev);

      //Hides the form
      toggleListEditor();
      //Change loading state
      setEditorIsLoading(false);
      //Clear all the inputs
      setListName("");
      setlistDescription("");
      setListCurrentTag("");
      setListTags([]);
      setListIndex(-1);
      //Returns success
      return;
    }
    
    //Verifies if there's an error
    if(data.error) {
      showSnackbar(data.message, "critic", snackbar);
    }
    //Cancels loading status
    setIsLoading(false);
  }

  return (
    <div
    className="min-h-screen bg-background grid grid-cols-[auto_1fr] overflow-hidden text-text"
    onKeyDown={(e) => {
      if(!form_creator.current || !form_editor.current) return;

      const current_creator : HTMLElement = form_creator.current;
      const current_editor : HTMLElement = form_editor.current;
      
      if(current_creator.classList.contains("flex")) {
        if(e.key === "Escape") return toggleListCreator();

        return;
      }

      if(current_editor.classList.contains("flex")) {
        if(e.key === "Escape") return toggleListEditor();
        
        return;
      }

      return;
    }}>
      { user ? (
        <>
          <SideBar
          email={user?.email}
          avatar={user.avatar_url}
          plan={user.plan}
          username={user.name}
          setExpanded={(isExpanded : boolean) => {
            setExpanded(isExpanded === true ? false : true);
          }}>
            {
              expanded && (
                <span className="w-full text-base font-bold p-2 mt-5 animate-fade-in-right">
                  Projects
                </span>
              )
            }

            {
              user.teams && user.teams.length > 0 && user.teams.map((team: Team, index) => 
                <Icon
                action={`/teams/${team.team_id}`}
                name={team.name}
                isDisplayed={expanded}
                key={index}>
                  <></>
                </Icon>
              )
            }
          </SideBar>
          <AIChat />
          <SnackBar
          ref={snackbar}/>

          {/* Creator form */}
          <div
          ref={form_creator}
          className="backdrop-brightness-60 backdrop-blur w-screen h-screen fixed top-0 left-0 flex-col justify-center items-center z-50 animate-fade-in hidden"
          onClick={toggleListCreator}>
            <CreatorForm
            title="Create a new to do list"
            action={handleCreateToDoList}
            hideAction={toggleListCreator}
            actionIsDisabled={ isLoading || !newListName || newListName.length < 3 || !newListDescription}>

              <CreatorInput
              label="To do list name"
              placeholder="My to do list"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}/>

              <CreatorInput
              label="To do list description"
              placeholder="Describe your to do list"
              type="textarea"
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}/>

              {/* Tags section */}
              <label
              className="font-light w-full text-start">
                List tags
              </label>
              <input
              type="text"
              className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400"
              value={currentTag || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCurrentTag(e.target.value)
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (currentTag && currentTag.trim().length > 0 && !tags.includes(currentTag)) {
                    setTags(prev => prev ? [
                      ...prev,
                      currentTag
                    ] : [ currentTag ]);
                    setCurrentTag("");
                  };
                  
                  if(tags.includes(currentTag!)) {
                    setCurrentTag("");
                  }
                }
              }}
              placeholder="API, Database, Code..."/>

              { /* Current tags */ }
              <div
              className="flex gap-1 flex-wrap justify-start items-center mb-10 w-full">
                { tags && tags.length > 0 && tags.map((tag, index) => (
                  <div
                  key={index}
                  className="w-max px-2 py-1 rounded-md bg-neutral-800 text-sm font-light cursor-default hover:bg-red-700 duration-400"
                  onClick={() => { setTags(tags.toSpliced(index, 1)); }}>
                    {tag}
                  </div>
                )) }
              </div>

            </CreatorForm>
          </div>

          {/* Editor form */}
          <div
          ref={form_editor}
          className="backdrop-brightness-60 backdrop-blur w-screen h-screen fixed top-0 left-0 flex-col justify-center items-center z-50 animate-fade-in hidden"
          onClick={toggleListEditor}>
            <CreatorForm
            title="Edit your to do list"
            action={handleEditToDoList}
            hideAction={toggleListEditor}
            actionIsDisabled={ editorIsLoading || !listName || listName.length < 3 || (listName === previousList?.title && listDescription === previousList?.description && listTags === previousList?.tags) }>

              <CreatorInput
              label="To do list name"
              placeholder="My to do list"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              required/>

              <CreatorInput
              label="To do list description"
              placeholder="Describe your to do list"
              type="textarea"
              value={listDescription}
              onChange={(e) => setlistDescription(e.target.value)}/>

              {/* Tags section */}
              <label
              className="font-light w-full text-start">
                List tags
              </label>
              <input
              type="text"
              className="w-full rounded-sm px-3 py-2 bg-neutral-800 text-sm focus:outline-none mb-3 text-text/80 border border-transparent focus:border-main duration-400"
              value={listCurrentTag || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setListCurrentTag(e.target.value)
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (listCurrentTag && listCurrentTag.trim().length > 0 && !tags.includes(listCurrentTag)) {
                    setListTags(prev => prev ? [
                      ...prev,
                      listCurrentTag
                    ] : [ listCurrentTag ]);
                    setListCurrentTag("");
                  };
                  
                  if(tags.includes(listCurrentTag!)) {
                    setListCurrentTag("");
                  }
                }
              }}
              placeholder="API, Database, Code..."/>

              { /* Current tags */ }
              <div
              className="flex gap-1 flex-wrap justify-start items-center mb-10 w-full">
                { listTags && listTags.length > 0 && listTags.map((tag, index) => (
                  <div
                  key={index}
                  className="w-max px-2 py-1 rounded-md bg-neutral-800 text-sm font-light cursor-default hover:bg-red-700 duration-400"
                  onClick={() => { setListTags(listTags.toSpliced(index, 1)); }}>
                    {tag}
                  </div>
                )) }
              </div>

            </CreatorForm>
          </div>

          <main
          className="relative flex flex-col h-screen overflow-y-auto px-4 md:px-8 animate-fade-in">
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <div className="absolute left-1/2 top-1/2 aspect-square block w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main/15 blur-3xl animate-pulse" />
            </div>

            {
              user?.plan && (
                <div
                className="flex justify-end items-center w-full my-5">
                  <span
                  className="text-sm px-5 py-1 bg-main shadow-lg shadow-main/30 rounded-full cursor-default">
                    { user.plan }
                  </span>
                </div>
              )
            }

            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-10">       
              <header className="flex h-max">
                <div
                className="flex flex-col justify-center items-between gap-2 w-full">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  Welcome back, {user.name}!
                  </h2>
                  <p className="text-text/70 text-sm md:text-base">
                    There are your recent projects
                  </p>
                </div>

                <button
                className="text-sm py-2 px-6 border border-neutral-900 rounded-full cursor-pointer duration-300 hover:border-neutral-800 h-max w-max flex gap-2 my-auto disabled:hover:brightness-80 disabled:hover:bg-transparent disabled:hover:scale-100 disabled:brightness-80 disabled:cursor-wait"
                disabled={isReloading}
                onClick={ async(e) => {
                  setIsReloading(true);
                  const token = useGetToken();

                  await UpdateUserData(token!);
                  setIsReloading(false);
                }}>
                  <IconReload
                  size={20}
                  color="white"
                  stroke={2} />

                  Refresh
                </button>
              </header>
              
              <section className="flex flex-col gap-6">
                
                <div className="flex w-full items-center justify-between">
                  <h3 className="text-xl font-semibold tracking-tight text-white/90">
                    To Do Lists
                  </h3>

                  <button
                  className="flex items-center gap-2 bg-main px-6 py-2 text-sm font-medium text-white rounded-full transition-all duration-300 hover:bg-main/80 focus:outline-none active:scale-95 cursor-pointer"
                  onClick={() => {
                    toggleListCreator();
                  }}>
                    <IconPlus
                    color="white"
                    size={16}
                    stroke={2.5}/>
                    Create new
                  </button>
                </div>


                <section
                className={user.to_do_list && user.to_do_list.length >= 1 ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "flex flex-col justify-center items-center"}>
                  { user?.to_do_list && user.to_do_list.length >= 1 ? 
                    user.to_do_list.map((list, index) => (
                      <section
                      key={index}
                      className="group relative w-full flex flex-col rounded-xl border border-neutral-800 cursor-pointer duration-500 hover:border-main hover:-translate-y-1 bg-neutral-950 p-5"
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.nativeEvent.stopImmediatePropagation();
                        e.stopPropagation();
                        setOpenMenuIndex(prev => prev === index ? null : index);
                      }}
                      onClick={() => {
                        router.push(`/todo/${index}`);
                      }}>

                        <header className="flex items-start justify-between mb-3">

                          <h3 className="text-lg font-semibold text-text tracking-tight line-clamp-1">
                            {list.title}
                          </h3>
                          
                          <button 
                            className="flex h-8 w-8 -mr-2 -mt-2 items-center justify-center rounded-full text-text hover:bg-neutral-800 outline-none"
                            onClick={(e) => {
                              e.nativeEvent.stopImmediatePropagation(); 
                              e.stopPropagation();
                              setOpenMenuIndex(prev => prev === index ? null : index);
                            }}>
                            <IconDotsVertical
                            size={16}
                            color="white"
                            stroke={3}/>
                          </button>

                          { openMenuIndex === index && (
                            <div className="absolute right-2 top-10 z-20 w-36 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
                              <button
                              onClick={(e) => {
                                e.nativeEvent.stopImmediatePropagation(); 
                                e.stopPropagation();
                                setListEditorData(index);
                                setOpenMenuIndex(null);
                              }}
                              className="flex w-full items-center px-4 py-2.5 text-sm text-text transition-colors hover:bg-neutral-700">

                              <IconPencil
                              size={20}
                              color="white" />

                              Edit
                            </button>
                            
                            <button
                            onClick={(e) => {
                              e.nativeEvent.stopImmediatePropagation(); 
                              e.stopPropagation();
                              setOpenMenuIndex(null);
                            }}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300">

                              <IconTrash
                              size={20}
                              stroke={1} />
                              
                              Delete
                            </button>
                            </div>
                        )}
                      </header>

                      <p className="text-sm text-text/60 line-clamp-3 leading-relaxed">
                        {list.description}
                      </p>

                      <section
                      className="flex gap-2 mt-2">
                        {
                          list.tags && list.tags.map((tag, index) => 
                            <span
                            className="py-0.5 px-3 rounded-md text-sm bg-main/40 border border-main"
                            key={tag + index.toString()}>
                              { tag }
                            </span>
                          )
                        }
                      </section>
                    </section>
                    )) : (
                    <span
                    className="w-full text-center text-2xl font-light text-text py-4"> No To Do lists found, try creating a new list!  </span>
                  ) }
                </section>

              </section>
            </div>
            
            
          </main>
        </>
      ) : (
        <LoadingDashboard />
      ) }
    </div>
  );
}