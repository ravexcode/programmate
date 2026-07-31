import animationClose from "@/utils/animation-close";

import { getUser } from "@/modules/user.module";

import type { UserData } from "@/types/user.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";


import { useEffect } from "react";

type SubmitData = {
  e: React.SubmitEvent<HTMLFormElement>;
  provider: string;
  setProvider: Dispatch<SetStateAction<string | undefined>>;
}

type TogglerData = {
  ref: React.RefObject<null>;
  showClass: string;
  hideClass: string;
  animationName: string;
}

export async function submitProvider(data: SubmitData) {
  data.e.preventDefault();
  
}

export function toggleComponent(data: TogglerData) {
  if(!data.ref.current) return;

  const element: HTMLElement = data.ref.current;
  const classes = element.classList;

  if(classes.contains(data.hideClass)) {
    classes.remove(data.hideClass);
    classes.add(data.showClass);
  }

  animationClose(element, data.animationName, data.hideClass, data.showClass);
}

export function useGetData(
  setUser: Dispatch<SetStateAction<UserData | undefined>>,
  router: AppRouterInstance,
) {
  useEffect(() => {
    const get = async() => {
      const data = await getUser(router);
      
      if(!data) return router.push("/dashboard");

      setUser(data);
    }

    get();
  }, []);
}