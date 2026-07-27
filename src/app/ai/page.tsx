"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { getUser } from "@/modules/user.module";

import LoadingScreen from "@/components/screens/loading-screen";
import AiLayout from "@/components/ai/layout";

import { rng } from "@/utils/rng";

import {
  IconArrowUp
} from "@tabler/icons-react";

import type { UserData } from "@/types/user.types";
import { AiChatSession } from "@/types/ai.types";
interface Model {
  name: string;
  provider: string;
  url?: string;
  api_key?: string;
}

export default function AiPage() {
  const router = useRouter();

  const [ user, setUser ] = useState<UserData>();

  const [ currentModel, setCurrentModel ] = useState<Model>();
  const [ session, setSession ] = useState<AiChatSession>();

  useEffect(() => {
    const get = async() => {
      const data = await getUser(router);

      if(!data) return;

      setUser(data);
    };

    get();
  }, []);

  const greetings: string[] = [
    "Hello, User! What are we building today?",
    "Welcome back, User! Ready to create something amazing?",
    "Hi, User! What's the project for today?",
    "Good to see you, User. What are we working on?",
    "Hello, User! Let's build something incredible.",
    "Hey, User! What idea are we turning into reality today?",
    "Welcome, User. What's on the development roadmap?",
    "Hi there, User! Ready to start coding?",
    "Hello, User! What challenge are we solving today?",
    "Hey, User! What are we creating together?",
    "Good to have you back, User! What's today's mission?",
    "Welcome, User! Let's make some progress.",
    "Hello, User! What's the next big feature?",
    "Hi, User! What project deserves our attention today?",
    "Hey, User! Time to build something awesome.",
    "Welcome back, User! What's your plan for today?",
    "Hello, User! Ready to bring another idea to life?",
    "Hi, User! What innovation are we working on today?",
    "Good day, User! What would you like to build?",
    "Hello, User! Let's get started on your next masterpiece."
  ];

  const gIndex = rng(greetings.length);

  if(!user) return <LoadingScreen />

  return (
    <AiLayout
    user={user}
    router={router}>

      <main
      className="w-full flex flex-col items-center justify-center max-w-350 mx-auto p-5">
        <section
        className="h-full w-full flex flex-col items-center justify-end">
          {
            session ? 
            <div>

            </div> :
            <div
            className="flex flex-col items-center justify-center h-full text-4xl font-light text-neutral-400 cursor-default select-none animate-fade-in-up">
              { greetings[gIndex].replace("User", user.name) }
            </div>
          }
        </section>

        <section
        className="w-full p-3 px-5 rounded-xl border border-neutral-900 bg-neutral-950 flex flex-col gap-2 animate-fade-in-up">
          <div
          className="w-full flex gap-3">
            <input
            type="text"
            placeholder="Ask me anything"
            className="w-full outline-none" />

            <button
            type="button"
            className="bg-main rounded-full aspect-square block hover:brightness-75 duration-300 cursor-pointer p-2">
              <IconArrowUp
              size={20} />
            </button>
          </div>

          <div
          className="w-full cursor-default text-sm font-light py-1">
            {currentModel ? currentModel.name : "No selected"}
          </div>

        </section>
      </main>

    </AiLayout>
  )
}