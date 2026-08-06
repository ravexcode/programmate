import animationClose from "@/utils/animation-close";

import { getUser } from "@/modules/user.module";

import { apiFetch } from "@/utils/http";

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
  }, [router, setUser]);
}

//-------- AI transport --------

export async function sendChatRequest(
  url: string,
  options: RequestInit
) {
  return fetch(url, options);
}

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function openRouterChatRequest(
  token: string,
  model: string,
  messages: ChatMessage[]
) {
  return apiFetch("/api/ai/openrouter/chat", {
    method: "POST",
    token,
    body: { model, messages },
  });
}

export async function chatCompletionRequest(data: {
  token: string;
  provider: string;
  model: string;
  messages: ChatMessage[];
}) {
  const res = await apiFetch("/api/ai/chat", {
    method: "POST",
    token: data.token,
    body: {
      provider: data.provider,
      model: data.model,
      messages: data.messages,
    },
  });

  return {
    message: res.data.message,
    content: res.data.content,
    status: res.status,
  };
}
