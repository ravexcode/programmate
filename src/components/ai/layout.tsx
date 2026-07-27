import type { UserData } from "@/types/user.types";
import type { ReactNode } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import AiSidebar from "./sidebar";

interface Props {
  user: UserData;
  children?: ReactNode
  router: AppRouterInstance
}

export default function AiLayout(props: Props) {
  return (
    <div
    className="min-h-screen grid grid-cols-[auto_1fr]">
      <AiSidebar
      user={props.user}
      router={props.router} />

      {props.children}

    </div>
  )
}