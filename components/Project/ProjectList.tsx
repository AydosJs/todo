"use client";
import InputComponent, { ListItem } from "@/components/InputComponent";
import TodoList from "@/components/TodoList";
import { useSessionStorage } from "@uidotdev/usehooks";
import ProjectTitle from "./ProjectTitle";
import { v4 as uuidv4 } from "uuid";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUpFromDot, Plus } from "lucide-react";
import { ProjectItem } from "./ProjectItem";

export interface Project {
  id: string;
  projectName: string;
  createdAt: Date;
  updatedAt: Date;
  todos: ListItem[];
}

export default function ProjectList() {
  const [projects, setProjects] = useSessionStorage<Project[]>("projects", []);

  const handleAddProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      projectName: `${projects.length + 1}. New Project`,
      createdAt: new Date(),
      updatedAt: new Date(),
      todos: [],
    };

    setProjects([...projects, newProject]);
    window.scrollTo(999999999, 999999999);
  };

  return (
    <div className="flex h-full w-full flex-col space-y-20">
      {projects.length > 0 && (
        <div className="z-5 fixed bottom-5 right-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="">
                <button
                  onClick={() => handleAddProject()}
                  className="rounded-full bg-stone-700 p-4 hover:bg-stone-800"
                >
                  <Plus className="size-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}

      {projects.length === 0 && (
        <div className="t absolute left-1/2 top-1/3 flex h-full -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center">
          <button
            onClick={() => handleAddProject()}
            className="group relative mb-10 mt-20 inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-stone-700/20 bg-stone-800/50 p-4 font-medium text-neutral-50"
          >
            <span className="absolute h-0 w-0 rounded-full bg-stone-50 transition-all duration-300 group-hover:h-56 group-hover:w-32"></span>
            <span className="relative">
              <Plus className="size-10 text-stone-50 transition-all group-hover:text-stone-800" />
            </span>
          </button>

          <span className="mb-10">
            <ArrowUpFromDot className="size-7 animate-bounce" />
          </span>

          <p className="text-center text-lg font-normal text-stone-50">
            There is no Projects yet:( Lets create one ✨
          </p>
        </div>
      )}
    </div>
  );
}
