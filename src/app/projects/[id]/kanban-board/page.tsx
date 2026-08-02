//Client side
"use client";

//Next imports
import { useRouter, useParams } from "next/navigation";

//React imports
import { useEffect, useState, useRef } from "react";

//Types imports
import type { UserData } from "@/types/user.types";

//Prebuild ui imports
import TeamSideBar from "@/components/dashboard/team-sidebar";
import SnackBar from "@/components/ui/snackbar";
import LoadingScreen from "@/components/screens/loading-screen";

//Board components imports
import Card from "@components/projects/kanban/card";
import List from "@/components/projects/kanban/list";

//Client imports
import {
  loadKanbanPage,
  moveCard,
  addCard,
  updateCardTitle,
  saveKanban,
  type KanbanList,
} from "@/client/projects/kanban";

//Types imports
import type Team from "@/types/team.types";

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

  //Sets the data
  useEffect(() => {
    async function get() {
      const data = await loadKanbanPage(Number(params.id), router, snackbar);

      if(!data) return;

      setUser(data.user);
      setTeam(data.team);

      return;
    }

    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async() => {
    if(!team) return;

    setIsLoading(true);
    await saveKanban(team, router, snackbar);
    setIsLoading(false);
  }

  const renderCards = (list: KanbanList) => {
    if(!team) return null;

    const cards = team.kanban_board[list] || [];

    return [...cards].reverse().map((card, reversedIndex) => {
      const index = cards.length - 1 - reversedIndex;

      return (
        <Card
        content={card}
        sourceList={list}
        onChange={(e) => {
          setTeam(
            prev => prev ? updateCardTitle(prev, list, index, e.target.value) : team
          )
        }}
        key={card.id} />
      )
    });
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
            onDrop={(sourceList, id) => {
              setTeam(prev => prev ? moveCard(prev, sourceList, id, "todo") : prev);
            }}>
              <button
              type="button"
              onClick={() => {
                setTeam(
                  prev => prev ? addCard(prev, "todo", user.name) : team
                )
              }}
              className="border border-dashed opacity-80 border-neutral-700 bg-neutral-900 rounded-md w-full p-2">
                + Add a new task
              </button>

              { renderCards("todo") }
            </List>

            <List type="inprogress"
            onDrop={(sourceList, id) => {
              setTeam(prev => prev ? moveCard(prev, sourceList, id, "inprogress") : prev);
            }}>
              { renderCards("inprogress") }
            </List>

            <List type="done"
            onDrop={(sourceList, id) => {
              setTeam(prev => prev ? moveCard(prev, sourceList, id, "done") : prev);
            }}>
              { renderCards("done") }
            </List>

            <List type="verified"
            onDrop={(sourceList, id) => {
              setTeam(prev => prev ? moveCard(prev, sourceList, id, "verified") : prev);
            }}>
              { renderCards("verified") }
            </List>
          </section>
        </main>
      </div>
    ) : (
      <LoadingScreen />
    )
  )
}
