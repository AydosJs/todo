"use client";
import { useSessionStorage } from "@uidotdev/usehooks";
import { ArrowUpFromDot, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Project } from "./project/ProjectList";

export default function NoProject() {
  const [projects, setProjects] = useSessionStorage<Project[]>("projects", []);

  const handleAddProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      projectName: `Untitled`,
      createdAt: new Date(),
      updatedAt: new Date(),
      todos: [],
    };

    setProjects([...projects, newProject]);
    window.scrollTo(999999999, 999999999);
  };

  return (
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
  );
}
