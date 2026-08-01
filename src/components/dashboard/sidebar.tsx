//React imports
import { memo } from "react";

//Prebuilt UI imports
import Icon from "./icon";
import SidebarLayout from "@/components/layouts/sidebar";

//Types imports
import type { UserData } from "@/types/user.types";

//Icons imports
import {
  IconChecklist,
  IconLayoutDashboard,
  IconSparkles
} from "@tabler/icons-react";

interface Props {
  user: UserData;
}

function SideBar({ user }: Props) {
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
        </>
      )}
    </SidebarLayout>
  )
}

//Optimization
export default memo(SideBar)
