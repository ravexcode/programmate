//Client side
"use client";

//Next imports
import { useRouter, useParams } from "next/navigation";

//React imports
import { useEffect, useState, useRef } from "react";

//Types imports
import { UserData } from "@/types/user.types";

//Prebuild ui imports
import SideBar, { Icon } from "@/components/ui/sidebar";
import SnackBar from "@/components/ui/snackbar";
import LoadingScreen from "@/components/screens/loading-screen";

//Board components imports
import Card from "@components/ui/kanban/card";
import List from "@/components/ui/kanban/list";

//Hooks imports
import { deleteSessionStr, getSessionStr } from "@/services/session.service";
import { getCached } from "@/hooks/cache.hook";

//Services imports
import getTeam from "@/services/team.service";
import getUser from "@/services/user.service";

//Actions imports
import { fetchTemplate } from "@/actions/template";

//Icons imports
import {
  IconAppWindow,
  IconCalendar,
  IconDatabase,
  IconEye,
  IconFolder,
  IconLayoutKanban,
  IconMessage,
  IconSettings,
  IconUsers
} from "@tabler/icons-react";

//Types imports
import Team from "@/types/team.types";

//Modules imports
import { v1 as uuidv1 } from "uuid";

export default function KanBanBoard() {
  //Next Setup
  const params = useParams();
  const router = useRouter();
  
  //States handler
  //User data
  const [ user, setUser ] = useState<UserData>();
  //Sidebar expanded
  const [ expanded, setExpanded ] = useState<boolean>(false);
  //Team data
  const [ team, setTeam ] = useState<Team>();
  //Saver button status
  const [ isLoading, setIsLoading ] = useState(false);

  //Snackbar container
  const snackbar = useRef(null);

  // Helper function to handle card movement between lists
  const handleCardDrop = (sourceList: string, id: string, targetList: string) => {
    setTeam(prev => {
      if(!prev) return prev;
      const card = prev.kanban_board[sourceList as keyof typeof prev.kanban_board].filter(card => card.id === id)[0];
      if(!card) return prev;
      
      const newTeam = { ...prev };
      
      // Always remove from source first
      newTeam.kanban_board[sourceList as keyof typeof newTeam.kanban_board] = 
        newTeam.kanban_board[sourceList as keyof typeof newTeam.kanban_board]?.filter((card) => card.id !== id) || [];
      
      // Add to destination list
      newTeam.kanban_board[targetList as keyof typeof newTeam.kanban_board] = [
        ...newTeam.kanban_board[targetList as keyof typeof newTeam.kanban_board] || [],
        card
      ];
      
      return newTeam;
    })
  };

  //Sidebar status
  useEffect(() => {
    const expanded = window.localStorage.getItem("expanded");

    if(expanded) return setExpanded(true);

    return;
  }, []);

  //Sets the data
  useEffect(() => {
    async function get() {
      let user_data : UserData;

      const token = getSessionStr();

      if(!token) return router.push("/auth/signin");

      const cached = getCached();

      if(cached) {
        user_data = cached
      } else {
        const fetched = await getUserService({router});
        
        if(!fetched) {
          deleteSessionStr();
          window.localStorage.clear();
          return router.push("/auth/signin");
        };

        user_data = fetched;
      }

      setUser(user_data);

      //Gets team data
      const team = await getTeam(
        Number(params.id),
        token,
        snackbar
      );

      setTeam(team);
      
      return;
    }

    get();
  }, []);

  const handleSave = async() => {
    if(!team) return;

    const token = getSessionStr();

    if(!token) return router.push("/auth/signin");

    setIsLoading(true);
    await fetchTemplate(
      `/api/teams/${team.team_id}/kanban`,
      "POST",
      snackbar,
      {
        "Authorization": token
      },
      JSON.stringify({
        kanban_data: team.kanban_board
      })
    )
    setIsLoading(false);
  }

  return (
    team && user ? (
      <div
      className="h-screen grid grid-cols-[auto_1fr] bg-background overflow-hidden">
        <SnackBar
        ref={snackbar} />

        <SideBar
        email={user?.email!}
        plan={user?.plan!}
        avatar={user?.avatar_url}
        username={user?.name!}
        setExpanded={(isExpanded : boolean) => {
          setExpanded(isExpanded === true ? false : true);
        }}>
          {
            expanded && (
              <span className="w-full text-base font-bold p-2 mt-5 animate-fade-in-right">
                Project 
              </span>
            )
          }

          <Icon
          action={`/projects/${params.id}`}
          name="Dashboard"
          isDisplayed={expanded}>
            <IconAppWindow
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/integrants`}
          name="Integrants"
          isDisplayed={expanded}>
            <IconUsers
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/tickets`}
          name="Tickets"
          isDisplayed={expanded}>
            <IconFolder
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/erd`}
          name="ERD Creator"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconDatabase
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/chat`}
          name="Chat"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconMessage
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/json-preview`}
          name="JSON Preview"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconEye
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/calendar`}
          name="Calendar"
          isDisplayed={expanded}
          disabled={ user?.plan === "Free" }>
            <IconCalendar
            size={23}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/settings`}
          name="Project settings"
          isDisplayed={expanded}>
            <IconSettings
            size={23}
            stroke={2}
            color="white"/>
          </Icon>
        </SideBar>

        <main
        className="min-h-screen">
          <header
          className="border-b border-neutral-700 p-4 flex justify-between items-center">
            <p
            className="text-3xl font-medium tracking-wide">
              { team.name } Kanban board
            </p>

            <button
            type="button"
            className="p-1 w-30 bg-main duration-300 cursor-pointer hover:bg-main/60 flex items-center justify-center rounded-md h-max disabled:grayscale disabled:cursor-wait disabled:hover:bg-main"
            disabled={isLoading}
            onClick={handleSave}>
              Update
            </button>
          </header>

          <section
          className="min-h-max h-full flex 2xl:grid 2xl:grid-cols-4 overflow-auto">
            <List type="todo"
            onDrop={(sourceList, id) => handleCardDrop(sourceList, id, "todo")}>
              <button
              type="button"
              onClick={() => {
                const random_uuid = uuidv1();

                setTeam(
                  prev => prev ? {
                    ...prev,
                    kanban_board: {
                      ...prev.kanban_board,
                      todo: [
                        ...prev.kanban_board.todo || [],
                        {
                          id: random_uuid,
                          title: "",
                          created_by: user.name
                        }
                      ]
                    }
                  } : team
                )
              }}
              className="border border-dashed opacity-80 border-neutral-700 bg-neutral-900 rounded-md w-full p-2">
                + Add a new task
              </button>

              {
                team.kanban_board && team.kanban_board.todo && [...team.kanban_board.todo].reverse().map((card, reversedIndex) => {
                  const index = team.kanban_board.todo.length - 1 - reversedIndex;
                  return (
                    <Card
                    content={card}
                    sourceList="todo"
                    onChange={(e) => {
                      setTeam(
                        prev => prev ? {
                          ...prev,
                          kanban_board: {
                            ...prev.kanban_board,
                            todo: prev.kanban_board.todo.filter((content, i) => {
                              if(i !== index) return content;

                              content.title = e.target.value

                              return content;
                            })
                          }
                        } : team
                      )
                    }}
                    key={card.id} />
                  )
                })
              }
            </List>

            <List type="inprogress"
            onDrop={(sourceList, id) => handleCardDrop(sourceList, id, "inprogress")}>
              {
                team.kanban_board && team.kanban_board.inprogress && [...team.kanban_board.inprogress].reverse().map((card, reversedIndex) => {
                  const index = team.kanban_board.inprogress.length - 1 - reversedIndex;
                  return (
                    <Card
                    content={card}
                    sourceList="inprogress"
                    onChange={(e) => {
                      setTeam(
                        prev => prev ? {
                          ...prev,
                          kanban_board: {
                            ...prev.kanban_board,
                            inprogress: prev.kanban_board.inprogress.filter((content, i) => {
                              if(i !== index) return content;

                              content.title = e.target.value

                              return content;
                            })
                          }
                        } : team
                      )
                    }}
                    key={card.id} />
                  )
                })
              }
            </List>

            <List type="done"
            onDrop={(sourceList, id) => handleCardDrop(sourceList, id, "done")}>
              {
                team.kanban_board && team.kanban_board.done && [...team.kanban_board.done].reverse().map((card, reversedIndex) => {
                  const index = team.kanban_board.done.length - 1 - reversedIndex;
                  return (
                    <Card
                    content={card}
                    sourceList="done"
                    onChange={(e) => {
                      setTeam(
                        prev => prev ? {
                          ...prev,
                          kanban_board: {
                            ...prev.kanban_board,
                            done: prev.kanban_board.done.filter((content, i) => {
                              if(i !== index) return content;

                              content.title = e.target.value

                              return content;
                            })
                          }
                        } : team
                      )
                    }}
                    key={card.id} />
                  )
                })
              }
            </List>

            <List type="verified"
            onDrop={(sourceList, cardIndex) => handleCardDrop(sourceList, cardIndex, "verified")}>
              {
                team.kanban_board && team.kanban_board.verified && [...team.kanban_board.verified].reverse().map((card, reversedIndex) => {
                  const index = team.kanban_board.verified.length - 1 - reversedIndex;
                  return (
                    <Card
                    content={card}
                    sourceList="verified"
                    onChange={(e) => {
                      setTeam(
                        prev => prev ? {
                          ...prev,
                          kanban_board: {
                            ...prev.kanban_board,
                            verified: prev.kanban_board.verified.filter((content, i) => {
                              if(i !== index) return content;

                              content.title = e.target.value

                              return content;
                            })
                          }
                        } : team
                      )
                    }}
                    key={card.id} />
                  )
                })
              }
            </List>
          </section>
        </main>
      </div>
    ) : (
      <LoadingScreen />
    )
  )
}