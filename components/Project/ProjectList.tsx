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
import { Plus } from "lucide-react";

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
        <div className="flex h-full flex-col items-center justify-center">
          <p className="text-center text-lg text-stone-100">
            There is no Projects yet Lets create one
          </p>

          <button
            onClick={() => handleAddProject()}
            className="mt-10 rounded-full bg-stone-800/50 p-4 hover:bg-stone-800"
          >
            <Plus className="size-10 text-stone-100" />
          </button>
        </div>
      )}
    </div>
  );
}

export function ProjectItem({ project }: Readonly<{ project: Project }>) {
  return (
    <div className="flex w-full flex-col">
      <ProjectTitle projectId={project.id} projectName={project.projectName} />

      <InputComponent projectId={project.id} />

      {project.todos.length > 0 && (
        <TodoList projectId={project.id} list={project.todos} />
      )}
    </div>
  );
}
