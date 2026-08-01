//Client side
"use client";

//Next imports
import { useRouter, useParams } from "next/navigation";

//React imports
import { useEffect, useState, useRef } from "react";

//Types imports
import { UserData } from "@/types/user.types";

//Prebuild ui imports
import TeamSideBar from "@/components/dashboard/team-sidebar";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";
import LoadingScreen from "@/components/screens/loading-screen";

//Board components imports
import Card from "@components/projects/kanban/card";
import List from "@/components/projects/kanban/list";

//Hooks imports
import { deleteSessionStr, getSessionStr } from "@/services/session.service";
import { getCached } from "@/utils/cache";

//Services imports
import { getUser } from "@/modules/user.module";
import { getTeam } from "@/modules/project/main.module";

//Actions imports
import { saveKanbanRequest } from "@/client/project";
import checkStatus from "@/utils/check-status";

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
        const fetched = await getUser(router);
        
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
         { id: Number(params.id), router, snackbar: snackbar }
       );


      setTeam(team);
      
      return;
    }

    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async() => {
    if(!team) return;

    const token = getSessionStr();

    if(!token) return router.push("/auth/signin");

    setIsLoading(true);
    const res = await saveKanbanRequest(
      token,
      team.team_id,
      team.kanban_board
    );
    showSnackbar(res.data.message, checkStatus(res.status), snackbar);
    setIsLoading(false);
  }

  return (
    team && user ? (
      <div
      className="h-screen grid grid-cols-[auto_1fr] bg-background overflow-hidden">
        <SnackBar
        ref={snackbar} />

        <TeamSideBar
        user={user}
        team={team} />

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