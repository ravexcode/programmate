import { useState } from "react";

export type Views = "dashboard" | "todo" | "ai";

import MiniDashboardSidebar from "./sidebar";
import ViewDashboard from "./dashboard";
import ViewToDo from "./todo";
import ViewAI from "./ai";
import DashboardCard from "./card";

export default function MiniDashboard() {
  const [ currentView, setCurrentView ] = useState<Views>("dashboard");

  const exampleProjects = [
    {
      "title": "NovaCommerce",
      "description": "Modern e-commerce solution with inventory and order management",
      "status": "Done",
      "tags": [
        "NextJS",
        "TailwindCSS",
        "PostgreSQL"
      ]
    },
    {
      "title": "InsightHub",
      "description": "Analytics dashboard for tracking business performance and KPIs",
      "status": "Planning",
      "tags": [
        "React",
        "ChartJS",
        "NodeJS"
      ]
    },
    {
      "title": "PixelStudio",
      "description": "Creative asset management platform for designers and content teams",
      "status": "On Hold",
      "tags": [
        "NextJS",
        "React",
        "MongoDB"
      ]
    }
  ];

  const exampleLists = [
    {
      title: "NexZero API Refactor",
      description: "List to organice the API Refactor based in tasks.",
      tags: [
        "Refactor",
        "NexZero",
        "API"
      ]
    },
    {
      title: "Fix database issues",
      description: "Fix MongoDB Database issues.",
      tags: [
        "Bugfix",
        "Issue",
        "MongoDB",
        "Freelance"
      ]
    },
    {
      title: "Phyton course tasks",
      description: "Learning phyton in Jhon Doe course",
      tags: [
        "Phyton",
        "Course",
        "Learning"
      ]
    }
  ]

  return (
    <div
    className="flex flex-row bg-background rounded-md border border-neutral-800 w-300 z-2 aspect-video mt-6 animate-fade-in-up animate-duration-1000">
      <MiniDashboardSidebar
      setCurrentView={setCurrentView} />

      <main
      className={"w-full h-full relative flex flex-col justify-center items-center " + (currentView !== "ai" && "p-10")}>
        {
          currentView !== "ai" && (
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden animate-zoom-in animate-duration-300">
              <div className="absolute left-1/2 top-1/2 aspect-square w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main animate-pulse scale-55 flex items-center justify-center blur-3xl brightness-40">
                <div className="aspect-square flex items-center justify-center w-8/10 bg-sky-600 rounded-full">
                  <div className="aspect-square block w-6/10 bg-sky-200 rounded-full" />
                </div>
              </div>
            </div>
          )
        }

        {
          currentView === "dashboard" ? (
            <ViewDashboard>
              {
                exampleProjects.map((project, index) => (
                  <DashboardCard
                  key={index + project.title}
                  title={project.title}
                  description={project.description}
                  status={project.status}
                  tags={project.tags} />
                ))
              }
            </ViewDashboard>
          ) : 
          currentView === "todo" ? (
            <ViewToDo>
              {
                exampleLists.map((list, index) => (
                  <DashboardCard
                  key={index + list.title}
                  title={list.title}
                  description={list.description}
                  tags={list.tags || []} />
                ))
              }
            </ViewToDo>
          ) : (
            <ViewAI />
          )
        }
      </main>
    </div>
  )
}