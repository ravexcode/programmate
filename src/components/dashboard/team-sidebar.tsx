//React imports
import { memo } from "react";

//Prebuilt UI imports
import Icon from "./icon";
import SidebarLayout from "@/components/layouts/sidebar";

//Types imports
import type { UserData } from "@/types/user.types";
import type Team from "@/types/team.types";

//Icons imports
import {
  IconAppWindow,
  IconCalendar,
  IconChecklist,
  IconDatabase,
  IconFolder,
  IconLayoutDashboard,
  IconLayoutKanban,
  IconSettings,
  IconSparkles,
  IconUsers
} from "@tabler/icons-react";

interface Props {
  user: UserData;
  team: Team;
}

function TeamSideBar({ user, team }: Props) {
  return (
    <SidebarLayout user={user}>
      {(expanded) => (
        <>
          <Icon
          action="/dashboard"
          name="Dashboard"
          isDisplayed={expanded}>
            <IconLayoutDashboard
            size={18}
            stroke={2}
            color="white" />
          </Icon>

          { expanded && ( <span className="w-full px-2 animate-fade-in-right"> User </span> ) }

          <Icon
          action="/todo"
          name="To Do lists"
          isDisplayed={expanded} >
            <IconChecklist
            size={18}
            stroke={2}
            color="white" />
          </Icon>

          <Icon
          action="/ai"
          name="NexZero AI"
          isDisplayed={expanded} >
            <IconSparkles
            size={18}
            stroke={2}
            color="white" />
          </Icon>

          { expanded && ( <span className="w-full px-2 animate-fade-in-right"> Project </span> ) }

          <Icon
          action={`/projects/${team.team_id}`}
          name="Project dashboard"
          isDisplayed={expanded}>
            <IconAppWindow
            size={18}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/integrants`}
          name="Integrants"
          isDisplayed={expanded}>
            <IconUsers
            size={18}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/tickets`}
          name="Issue Tracking"
          isDisplayed={expanded}>
            <IconFolder
            size={18}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/erd`}
          name="Database diagram"
          isDisplayed={expanded}
          disabled={ user.plan === "Free" }>
            <IconDatabase
            size={18}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/kanban-board`}
          name="Kanban board"
          isDisplayed={expanded}
          disabled={ user.plan === "Free" }>
            <IconLayoutKanban
            size={18}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/calendar`}
          name="Calendar"
          isDisplayed={expanded}
          disabled={ user.plan === "Free" }>
            <IconCalendar
            size={18}
            stroke={2}
            color="white"/>
          </Icon>

          <Icon
          action={`/projects/${team.team_id}/settings`}
          name="Project settings"
          isDisplayed={expanded}>
            <IconSettings
            size={18}
            stroke={2}
            color="white"/>
          </Icon>
        </>
      )}
    </SidebarLayout>
  )
}

//Optimization
export default memo(TeamSideBar)
